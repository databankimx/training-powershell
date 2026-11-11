// test/run.test.js
//
// Checks how a step's PowerShell file is run, and how the runner decides that PowerShell 7 is installed. The real
// pwsh command is never started here: a stand-in plays its part.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { FILE_NAMES, commandFor } = require('../core/run');
const { COMMANDS, probe, probeAll } = require('../core/toolchains');

test('PowerShell runs its file with PowerShell 7, no profile, and the execution policy bypassed', () => {
  assert.equal(FILE_NAMES.powershell, 'main.ps1');
  assert.deepEqual(commandFor('powershell', 'main.ps1'), {
    command: 'pwsh',
    args: ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'main.ps1'],
  });
});

test('an unknown language is refused', () => {
  assert.throws(() => commandFor('typescript', 'main.ts'), /no way to run typescript/);
});

test('the version check asks pwsh for its version', () => {
  assert.deepEqual(COMMANDS.powershell, { command: 'pwsh', args: ['--version'] });
});

test('a language whose command runs is available, with its first line of version output', async () => {
  const fakeRun = (command, args, options, callback) => callback(null, 'PowerShell 7.6.9\nmore text\n', '');
  assert.deepEqual(await probe('powershell', fakeRun), { available: true, version: 'PowerShell 7.6.9' });
});

test('a language whose command is missing is unavailable', async () => {
  const fakeRun = (command, args, options, callback) => callback(new Error('not found'), '', '');
  assert.deepEqual(await probe('powershell', fakeRun), { available: false, version: null });
});

test('probeAll checks PowerShell 7 and nothing else', async () => {
  const commandsSeen = [];
  const fakeRun = (command, args, options, callback) => {
    commandsSeen.push(command);
    callback(null, 'PowerShell 7.6.9', '');
  };
  const result = await probeAll(fakeRun);
  assert.deepEqual(Object.keys(result), ['powershell']);
  assert.deepEqual(commandsSeen, ['pwsh']);
});
