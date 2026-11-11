// core/practice.js
//
// The practice folder is where the tutorial's exercises create and change files. The runner empties it before an
// exercise that checks files, so an exercise never sees files left by another one. The runner only ever empties
// this one folder. It refuses any other path, so a bad setting can't empty anything else.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const PRACTICE_FOLDER = 'C:\\Development\\ps-practice';

// Files bigger than this are recorded without their text. An exercise has no reason to write a file that large.
const MAX_TEXT_BYTES = 1024 * 1024;

function sameFolder(a, b) {
  return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

// Empties the folder, and keeps the folder itself. Creates it if it's missing. `allowed` is the only folder it will touch.
function resetFolder(folder, allowed = PRACTICE_FOLDER) {
  if (!sameFolder(folder, allowed)) {
    throw new Error(`The runner only empties ${allowed}, and it was asked to empty ${folder}.`);
  }
  fs.mkdirSync(folder, { recursive: true });
  for (const entry of fs.readdirSync(folder)) {
    fs.rmSync(path.join(folder, entry), { recursive: true, force: true });
  }
}

// Lists every file in the folder, with its text. The keys are paths relative to the folder, with forward slashes, so
// they read the same on any machine. A file too big to read as text is recorded as null.
function snapshotFolder(folder) {
  const files = {};
  if (!fs.existsSync(folder)) return files;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const key = path.relative(folder, full).split(path.sep).join('/');
      files[key] = fs.statSync(full).size > MAX_TEXT_BYTES ? null : fs.readFileSync(full, 'utf8');
    }
  };
  walk(folder);
  return files;
}

module.exports = { PRACTICE_FOLDER, resetFolder, snapshotFolder };
