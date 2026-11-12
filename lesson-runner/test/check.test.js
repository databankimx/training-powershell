// test/check.test.js
//
// Checks the syntax-check commands, the error parsing for each language, and the output comparison. These are the
// pure parts of the Check button; the commands themselves run on the learner's machine.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { PYTHON_SYNTAX_SCRIPT, syntaxCommand, parseDiagnostics, outputMatches } = require('../core/check');

test('PowerShell is checked with its own parser, and its errors are read from JSON', () => {
  const command = syntaxCommand('powershell', 'main.ps1');
  assert.equal(command.command, 'pwsh');
  assert.match(command.args[2], /Parser\]::ParseFile\('main\.ps1'/);
  const items = parseDiagnostics('powershell', {
    exitCode: 0,
    stdout: '[{"line":2,"column":5,"message":"Missing closing parenthesis"}]',
    stderr: '',
  });
  assert.deepEqual(items, [{ line: 2, column: 5, message: 'Missing closing parenthesis' }]);
  assert.deepEqual(parseDiagnostics('powershell', { exitCode: 0, stdout: '[]', stderr: '' }), []);
});

test('each language has a syntax check command for its file', () => {
  assert.deepEqual(syntaxCommand('python', 'main.py').args.slice(2), ['main.py']);
  assert.deepEqual(syntaxCommand('javascript', 'main.js'), { command: 'node', args: ['--check', 'main.js'] });
  assert.deepEqual(syntaxCommand('csharp', 'main.cs'), { command: 'dotnet', args: ['run', 'main.cs'] });
  assert.throws(() => syntaxCommand('typescript', 'main.ts'), /no syntax check for typescript/);
});

test('the Python syntax script is a single program that reads the file it is given', () => {
  assert.match(PYTHON_SYNTAX_SCRIPT, /sys\.argv\[1\]/);
  assert.match(PYTHON_SYNTAX_SCRIPT, /ast\.parse/);
});

test('a valid Python file reports no errors', () => {
  const items = parseDiagnostics('python', { exitCode: 0, stdout: '[]\n', stderr: '' });
  assert.deepEqual(items, []);
});

test('a Python syntax error reports its line, column, and message', () => {
  const stdout = JSON.stringify([{ line: 3, column: 9, message: "'(' was never closed" }]);
  const items = parseDiagnostics('python', { exitCode: 0, stdout, stderr: '' });
  assert.deepEqual(items, [{ line: 3, column: 9, message: "'(' was never closed" }]);
});

test('a Python check that fails to report is shown as a problem, not as success', () => {
  const items = parseDiagnostics('python', { exitCode: 1, stdout: 'not json', stderr: 'Traceback\nboom' });
  assert.equal(items.length, 1);
  assert.equal(items[0].message, 'boom');
});

test('a valid JavaScript file reports no errors', () => {
  assert.deepEqual(parseDiagnostics('javascript', { exitCode: 0, stdout: '', stderr: '' }), []);
});

test('a JavaScript syntax error is read from the location, caret, and message Node prints', () => {
  const stderr = [
    'C:\\course\\main.js:2',
    'console.log("hi"',
    '            ^',
    '',
    'SyntaxError: missing ) after argument list',
    '',
    'Node.js v24.0.0',
  ].join('\n');
  const items = parseDiagnostics('javascript', { exitCode: 1, stdout: '', stderr });
  assert.deepEqual(items, [{ line: 2, column: 13, message: 'missing ) after argument list' }]);
});

test('C# compile errors are read from the dotnet output, with line and column', () => {
  const stdout = [
    'main.cs(3,5): error CS1002: ; expected [/path/main.csproj]',
    'main.cs(7,1): error CS0103: The name "foo" does not exist in the current context',
  ].join('\n');
  const items = parseDiagnostics('csharp', { exitCode: 1, stdout, stderr: '' });
  assert.deepEqual(items, [
    { line: 3, column: 5, message: 'CS1002: ; expected [/path/main.csproj]' },
    { line: 7, column: 1, message: 'CS0103: The name "foo" does not exist in the current context' },
  ]);
});

test('ordinary C# program output is not reported as an error', () => {
  const items = parseDiagnostics('csharp', { exitCode: 0, stdout: '2 + 3 = 5\n', stderr: '' });
  assert.deepEqual(items, []);
});

test('the output check ignores line endings and trailing spaces, but not the words', () => {
  assert.equal(outputMatches('2 + 3 = 5\r\n4 is even\n', '2 + 3 = 5  \n4 is even'), true);
  assert.equal(outputMatches('4 is even', '4 is odd'), false);
});
