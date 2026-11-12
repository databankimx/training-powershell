// core/run.js
//
// Works out how to run a step's code for each language. The runner writes the learner's code to a file with the
// name given here, then starts the command this module returns. Nothing is run from the tutorial folder.

'use strict';

const FILE_NAMES = {
  powershell: 'main.ps1',
};

// The command to run one file. The file runs in PowerShell 7, with no profile loaded, so every learner gets the same
// starting point, and the execution policy is bypassed for this one script only.
function commandFor(language, file) {
  switch (language) {
    case 'powershell':
      return {
        command: 'pwsh',
        args: ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', file],
      };
    default:
      throw new Error(`The runner has no way to run ${language}.`);
  }
}

module.exports = { FILE_NAMES, commandFor };
