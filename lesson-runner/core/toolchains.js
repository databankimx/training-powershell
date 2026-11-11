// core/toolchains.js
//
// Finds out which languages can run on this machine, by asking each language's command for its version.
// A language whose command is missing or fails is marked unavailable, and the runner hides its tab.

'use strict';

// This tutorial runs PowerShell 7 only. `pwsh --version` prints its version, which the runner shows to the learner.
const COMMANDS = {
  powershell: { command: 'pwsh', args: ['--version'] },
};

// `run` is the child-process function to use. It's passed in so tests can stand in for the real commands.
function probe(language, run) {
  const spec = COMMANDS[language];
  return new Promise((resolve) => {
    run(spec.command, spec.args, { timeout: 15000, windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        resolve({ available: false, version: null });
        return;
      }
      const text = String(stdout || stderr || '').trim();
      resolve({ available: true, version: text.split('\n')[0] || null });
    });
  });
}

async function probeAll(run) {
  const result = {};
  for (const language of Object.keys(COMMANDS)) {
    result[language] = await probe(language, run);
  }
  return result;
}

module.exports = { COMMANDS, probe, probeAll };
