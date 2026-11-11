// test/highlight.test.js
//
// Checks that the course's languages are colored, that other text is escaped, and that markdown code blocks pick
// up the highlighting when the renderer is given it.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { highlightCode, markdownHighlight } = require('../core/highlight');
const { createRenderer } = require('../core/markdown');

test('C# keywords are marked for coloring', () => {
  const html = highlightCode('public int x = 1;', 'csharp');
  assert.match(html, /hljs-keyword">public</);
  // The highlighter marks the type name with a class of its own, so checking for any class keeps this test stable.
  assert.match(html, /class="hljs-[a-z_-]+">int</);
});

test('Python and JavaScript keywords are marked for coloring', () => {
  assert.match(highlightCode('def add(a, b):', 'python'), /hljs-keyword">def</);
  assert.match(highlightCode('const x = 1;', 'javascript'), /hljs-keyword">const</);
});

test('a language the course does not use is shown as escaped plain text', () => {
  const html = highlightCode('<b>hi</b>', 'cobol');
  assert.equal(html, '&lt;b&gt;hi&lt;/b&gt;');
  assert.doesNotMatch(html, /hljs/);
});

test('code in a markdown block is highlighted when the renderer is given the highlighter', () => {
  const md = createRenderer({ highlight: markdownHighlight });
  const html = md.render('```python\ndef add(a, b):\n    return a + b\n```\n');
  assert.match(html, /<pre><code class="hljs">/);
  assert.match(html, /hljs-keyword">def</);
});

test('the renderer without a highlighter still renders plain code blocks', () => {
  const md = createRenderer();
  const html = md.render('```python\nprint(1)\n```\n');
  assert.match(html, /<pre><code class="language-python">print\(1\)/);
});
