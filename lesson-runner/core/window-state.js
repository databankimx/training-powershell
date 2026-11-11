// core/window-state.js
//
// Remembers where the pop-out window was, so it reopens in the same place and size. The position is kept in its own
// file in the user data folder, and it is used only if enough of the window is still on a connected screen. If a
// monitor has been unplugged, the caller falls back to the default position.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

// How much of the window must lie on a screen, in pixels, in each direction. This keeps the title bar reachable.
const MIN_VISIBLE = 120;

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

// Returns the saved bounds, or null when there is no usable file.
function loadWindowState(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!['x', 'y', 'width', 'height'].every((key) => isNumber(data[key]))) return null;
    if (data.width <= 0 || data.height <= 0) return null;
    return {
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      maximized: data.maximized === true,
    };
  } catch {
    return null;
  }
}

function saveWindowState(file, bounds) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(bounds, null, 2), 'utf8');
}

// True when enough of the window lies on at least one of the work areas (the screen minus the taskbar).
function isVisibleOn(bounds, workAreas) {
  return workAreas.some((area) => {
    const overlapWidth = Math.min(bounds.x + bounds.width, area.x + area.width) - Math.max(bounds.x, area.x);
    const overlapHeight = Math.min(bounds.y + bounds.height, area.y + area.height) - Math.max(bounds.y, area.y);
    return overlapWidth >= MIN_VISIBLE && overlapHeight >= MIN_VISIBLE;
  });
}

module.exports = { loadWindowState, saveWindowState, isVisibleOn, MIN_VISIBLE };
