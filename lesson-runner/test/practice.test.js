// test/practice.test.js
//
// Checks the practice folder reset, the snapshot the files check reads, and the comparison of files with the expectation.
// Every test uses a temporary folder. None of them touch the real practice folder.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { PRACTICE_FOLDER, resetFolder, snapshotFolder } = require('../core/practice');
const { compareFiles } = require('../core/check');

function tempFolder(name) {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'practice-test-')), name);
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

test('the practice folder is the one the tutorial names', () => {
  assert.equal(PRACTICE_FOLDER, 'C:\\Development\\ps-practice');
});

test('a reset empties the folder, including subfolders, and keeps the folder itself', () => {
  const folder = tempFolder('ps-practice');
  writeFile(path.join(folder, 'old.txt'), 'left over');
  writeFile(path.join(folder, 'sub', 'deeper.txt'), 'left over');

  resetFolder(folder, folder);

  assert.ok(fs.existsSync(folder), 'the folder itself is kept');
  assert.deepEqual(fs.readdirSync(folder), []);
});

test('a reset creates the folder when it is missing', () => {
  const folder = tempFolder('ps-practice');
  resetFolder(folder, folder);
  assert.ok(fs.existsSync(folder));
});

test('a reset refuses any folder other than the one allowed, and empties nothing', () => {
  const allowed = tempFolder('ps-practice');
  const other = tempFolder('somewhere-else');
  writeFile(path.join(other, 'keep.txt'), 'must survive');

  assert.throws(() => resetFolder(other, allowed), /only empties/);
  assert.equal(fs.readFileSync(path.join(other, 'keep.txt'), 'utf8'), 'must survive');
});

test('the folder check ignores case in the path, because Windows does', () => {
  const folder = tempFolder('ps-practice');
  writeFile(path.join(folder, 'old.txt'), 'left over');
  resetFolder(folder.toUpperCase(), folder.toLowerCase());
  assert.deepEqual(fs.readdirSync(folder), []);
});

test('a snapshot lists every file with its text, using forward slashes', () => {
  const folder = tempFolder('ps-practice');
  writeFile(path.join(folder, 'notes.txt'), 'Hello\n');
  writeFile(path.join(folder, 'docs', 'readme.txt'), 'Inside a folder\n');

  assert.deepEqual(snapshotFolder(folder), {
    'notes.txt': 'Hello\n',
    'docs/readme.txt': 'Inside a folder\n',
  });
});

test('a snapshot of a missing folder is empty', () => {
  assert.deepEqual(snapshotFolder(tempFolder('never-made')), {});
});

test('a file the expectation names must exist', () => {
  assert.deepEqual(compareFiles({ 'notes.txt': null }, {}), ['notes.txt is missing']);
  assert.deepEqual(compareFiles({ 'notes.txt': null }, { 'notes.txt': 'anything' }), []);
});

test('a file given with text must have that text, where line endings and trailing spaces do not count', () => {
  assert.deepEqual(compareFiles({ 'notes.txt': 'Hello\n' }, { 'notes.txt': 'Hello  \r\n' }), []);
  assert.deepEqual(compareFiles({ 'notes.txt': 'Hello\n' }, { 'notes.txt': 'Goodbye\n' }), [
    'notes.txt does not have the expected text',
  ]);
});

test('files the expectation does not mention are ignored', () => {
  assert.deepEqual(compareFiles({ 'notes.txt': null }, { 'notes.txt': 'x', 'extra.txt': 'y' }), []);
});

test('a file given as false must be gone', () => {
  assert.deepEqual(compareFiles({ 'old.txt': false }, { 'old.txt': 'still here' }), ['old.txt should have been removed']);
  assert.deepEqual(compareFiles({ 'old.txt': false }, {}), []);
});

test('a file too big to read counts as having the wrong text when the expectation gives text', () => {
  assert.deepEqual(compareFiles({ 'big.txt': 'small' }, { 'big.txt': null }), [
    'big.txt does not have the expected text',
  ]);
});
