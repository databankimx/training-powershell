// test/window-state.test.js
//
// Checks that the pop-out's saved position is only used when enough of the window is on a screen.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { loadWindowState, saveWindowState, isVisibleOn } = require('../core/window-state');

const primary = { x: 0, y: 0, width: 1920, height: 1040 };
const secondary = { x: 1920, y: 0, width: 2560, height: 1400 };

function tempFile() {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'window-state-test-')), 'nested', 'window-state.json');
}

test('a window fully inside a screen is visible', () => {
  assert.equal(isVisibleOn({ x: 100, y: 100, width: 900, height: 700 }, [primary]), true);
});

test('a window on a second screen is visible when that screen is connected', () => {
  const bounds = { x: 2200, y: 200, width: 900, height: 700 };
  assert.equal(isVisibleOn(bounds, [primary, secondary]), true);
  assert.equal(isVisibleOn(bounds, [primary]), false, 'the same spot is off-screen once the second monitor is gone');
});

test('a window with only a sliver on screen is not visible, so the title bar stays reachable', () => {
  assert.equal(isVisibleOn({ x: 1900, y: 100, width: 900, height: 700 }, [primary]), false);
});

test('the saved bounds round-trip through the file, creating folders as needed', () => {
  const file = tempFile();
  saveWindowState(file, { x: 10, y: 20, width: 800, height: 600, maximized: true });
  assert.deepEqual(loadWindowState(file), { x: 10, y: 20, width: 800, height: 600, maximized: true });
});

test('a missing, damaged, or incomplete file gives no saved bounds', () => {
  const file = tempFile();
  assert.equal(loadWindowState(file), null);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '{ not json', 'utf8');
  assert.equal(loadWindowState(file), null);

  fs.writeFileSync(file, JSON.stringify({ x: 1, y: 2, width: 0, height: 600 }), 'utf8');
  assert.equal(loadWindowState(file), null, 'a zero-width window is not restored');
});
