// core/check.js
//
// The Check button: a syntax check first, and an output check when the syntax passes. Everything here is a pure
// function, so it can be tested without running any language. main.js does the running.
//
// Python and JavaScript are checked without running the program. For C#, `dotnet run` both compiles and runs the file,
// so its compile errors are read from that run, and its output is then used for the output check.

'use strict';

// Parses a Python file without running it, and prints the first syntax error as JSON (an empty list when it's valid).
const PYTHON_SYNTAX_SCRIPT = [
  'import ast, json, sys',
  'path = sys.argv[1]',
  'try:',
  '    with open(path, encoding="utf-8") as handle:',
  '        ast.parse(handle.read(), path)',
  '    print(json.dumps([]))',
  'except SyntaxError as error:',
  '    print(json.dumps([{"line": error.lineno or 1, "column": error.offset or 1, "message": error.msg}]))',
].join('\n');

// The PowerShell syntax check. PowerShell's own parser reads the file without running it, and prints the errors as JSON.
// The file name is the runner's own name for the learner's file (main.ps1), never text the learner typed.
function powershellSyntaxScript(file) {
  return [
    `$tokens = $null; $errors = $null;`,
    `[System.Management.Automation.Language.Parser]::ParseFile('${file}', [ref]$tokens, [ref]$errors) | Out-Null;`,
    `$items = @($errors | ForEach-Object { [pscustomobject]@{ line = $_.Extent.StartLineNumber; column = $_.Extent.StartColumnNumber; message = $_.Message } });`,
    `ConvertTo-Json -InputObject $items -Compress`,
  ].join(' ');
}

// The command that checks one file's syntax. The JavaScript check reports through its exit code and stderr.
function syntaxCommand(language, file) {
  switch (language) {
    case 'powershell':
      return { command: 'pwsh', args: ['-NoProfile', '-Command', powershellSyntaxScript(file)] };
    case 'python':
      return { command: 'python', args: ['-c', PYTHON_SYNTAX_SCRIPT, file] };
    case 'javascript':
      return { command: 'node', args: ['--check', file] };
    case 'csharp':
      return { command: 'dotnet', args: ['run', file] };
    default:
      throw new Error(`The runner has no syntax check for ${language}.`);
  }
}

// Reads the errors from a syntax check's result: { exitCode, stdout, stderr }. Returns a list of { line, column, message }.
function parseDiagnostics(language, result) {
  const { exitCode, stdout = '', stderr = '' } = result;

  if (language === 'python' || language === 'powershell') {
    try {
      const items = JSON.parse(stdout.trim() || '[]');
      return Array.isArray(items) ? items : [];
    } catch {
      return [{ line: 1, column: 1, message: (stderr.trim() || 'The syntax check did not finish.').split('\n').pop() }];
    }
  }

  if (language === 'javascript') {
    if (exitCode === 0) return [];
    // Node prints the file and line, the source line, a caret under the error, and then the message.
    const location = /^(.*):(\d+)\r?$/m.exec(stderr);
    const caret = /^([ \t]*)\^+/m.exec(stderr);
    const message = /^(\w*Error): (.*)$/m.exec(stderr);
    return [
      {
        line: location ? Number(location[2]) : 1,
        column: caret ? caret[1].length + 1 : 1,
        message: message ? message[2] : (stderr.trim().split('\n').pop() || 'Syntax error.'),
      },
    ];
  }

  if (language === 'csharp') {
    const pattern = /^(.+?)\((\d+),(\d+)\): error (CS\d+): (.*)$/gm;
    const items = [];
    for (const match of `${stdout}\n${stderr}`.matchAll(pattern)) {
      items.push({ line: Number(match[2]), column: Number(match[3]), message: `${match[4]}: ${match[5].trim()}` });
    }
    return items;
  }

  return [];
}

// Compares the files a script left behind with the expectation. Each expected file must exist. A file given with text
// must have that text, where line endings and trailing spaces are not significant. A file given as null only has to
// exist. Files the expectation doesn't mention are ignored, so a script can leave extra files without failing.
function compareFiles(expectedFiles, actualFiles) {
  const problems = [];
  for (const [name, text] of Object.entries(expectedFiles)) {
    const present = Object.prototype.hasOwnProperty.call(actualFiles, name);
    // false means the file must be gone, which is how an exercise about deleting checks its work.
    if (text === false) {
      if (present) problems.push(`${name} should have been removed`);
      continue;
    }
    if (!present) {
      problems.push(`${name} is missing`);
      continue;
    }
    if (text === null) continue;
    const actual = actualFiles[name];
    if (actual === null || !outputMatches(text, actual)) {
      problems.push(`${name} does not have the expected text`);
    }
  }
  return problems;
}

// Compares the program's output with the expected result. Line endings and trailing spaces are not significant.
function outputMatches(expected, actual) {
  return normalize(expected) === normalize(actual);
}

function normalize(text) {
  return String(text)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

module.exports = { PYTHON_SYNTAX_SCRIPT, syntaxCommand, parseDiagnostics, outputMatches, compareFiles };
