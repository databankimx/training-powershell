// renderer/icons.js
//
// The glyphs used in the window, drawn on an 18 x 18 grid, in the same style as the TypeScript runner.
// Loaded before renderer.js, as a classic script.

(function () {
  'use strict';

  const ICONS = {
    checkmark: '<polyline points="3,9 7,13 15,5"/>',
    copy: '<rect x="3.5" y="5.5" width="9" height="9.5" rx="2"/><rect x="6.5" y="2.5" width="9" height="9.5" rx="2"/>',
    clear: '<line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/>',
    popout: '<line x1="5" y1="13" x2="13" y2="5"/><polyline points="7,5 13,5 13,11"/>',
    dock: '<line x1="13" y1="5" x2="5" y2="13"/><polyline points="5,7 5,13 11,13"/>',
    moon:
      '<defs><mask id="moon-cut"><rect width="18" height="18" fill="white"/><circle cx="12.5" cy="6.5" r="5.5" fill="black"/></mask></defs>' +
      '<circle cx="9" cy="9" r="6.5" fill="currentColor" stroke="none" mask="url(#moon-cut)"/>',
    sun:
      '<circle cx="9" cy="9" r="3.5"/><line x1="9" y1="1" x2="9" y2="3"/><line x1="9" y1="15" x2="9" y2="17"/>' +
      '<line x1="1" y1="9" x2="3" y2="9"/><line x1="15" y1="9" x2="17" y2="9"/><line x1="3.5" y1="3.5" x2="5" y2="5"/>' +
      '<line x1="13" y1="13" x2="14.5" y2="14.5"/><line x1="3.5" y1="14.5" x2="5" y2="13"/><line x1="13" y1="5" x2="14.5" y2="3.5"/>',
    chevron: '<polyline points="6,4 11,9 6,14"/>',
    'chevron-left': '<polyline points="12,4 7,9 12,14"/>',
    'triangle-left': '<polygon points="11,4 5,9 11,14" fill="currentColor" stroke="none"/>',
    'triangle-right': '<polygon points="7,4 13,9 7,14" fill="currentColor" stroke="none"/>',
  };

  window.icon = function icon(name, size) {
    const pixels = size || 16;
    return (
      '<svg class="icon" viewBox="0 0 18 18" width="' + pixels + '" height="' + pixels + '" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || '') +
      '</svg>'
    );
  };
})();
