// core/highlight.js
//
// Colors code for the lesson text and the editor. Only the course's three languages are colored; anything else is
// shown as plain text. The output is HTML with highlight.js class names, which the page styles. The text is escaped,
// so code can't inject markup.

'use strict';

const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('csharp', require('highlight.js/lib/languages/csharp'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));

const ALIASES = {
  csharp: 'csharp',
  cs: 'csharp',
  python: 'python',
  py: 'python',
  javascript: 'javascript',
  js: 'javascript',
  markdown: 'markdown',
  md: 'markdown',
};

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Returns the highlighted HTML for the code, without a <pre> around it.
function highlightCode(code, language) {
  const name = ALIASES[String(language || '').toLowerCase()];
  if (!name) return escapeHtml(code);
  return hljs.highlight(code, { language: name, ignoreIllegals: true }).value;
}

// The form markdown-it expects from its highlight option: a complete <pre> block.
function markdownHighlight(code, language) {
  return `<pre><code class="hljs">${highlightCode(code, language)}</code></pre>\n`;
}

module.exports = { highlightCode, markdownHighlight };
