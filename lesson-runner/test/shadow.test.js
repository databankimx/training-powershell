// test/shadow.test.js
//
// Checks the shadow fence: the suggestion is wrapped in a faded span, the markers are removed, and the typed code
// around it is kept as it is, escaped.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { createRenderer } = require('../core/markdown');

test('the text between the ghost markers is wrapped in a faded span', () => {
  const html = createRenderer().render('~~~shadow\ntotal = {{ghost}}sum(values){{/ghost}}\n~~~\n');
  assert.match(html, /<pre class="shadow"><code>total = <span class="ghost">sum\(values\)<\/span>\n<\/code><\/pre>/);
});

test('the markers themselves never appear in the output', () => {
  const html = createRenderer().render('~~~shadow\na{{ghost}}b{{/ghost}}c\n~~~\n');
  assert.doesNotMatch(html, /\{\{ghost\}\}|\{\{\/ghost\}\}/);
});

test('typed code outside the markers is not faded', () => {
  const html = createRenderer().render('~~~shadow\ndef average(values):\n{{ghost}}    return 1{{/ghost}}\n~~~\n');
  assert.match(html, /def average\(values\):\n<span class="ghost">    return 1<\/span>/);
});

test('the shadow content is escaped, so code cannot inject markup', () => {
  const html = createRenderer().render('~~~shadow\nx = {{ghost}}"<script>"{{/ghost}}\n~~~\n');
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('a shadow sample in an examples block is colored, and its faded text keeps its colors', () => {
  const block = [
    '~~~examples',
    '```csharp',
    'int total = {{ghost}}sum(values);{{/ghost}}',
    '```',
    '```python',
    'total = {{ghost}}sum(values){{/ghost}}',
    '```',
    '```javascript',
    'const total = {{ghost}}sum(values);{{/ghost}}',
    '```',
    '~~~',
    '',
  ].join('\n');
  const html = createRenderer().render(block);
  assert.doesNotMatch(html, /\{\{ghost\}\}|\{\{\/ghost\}\}/);
  assert.match(html, /<span class="ghost">/);
  assert.match(html, /class="hljs-/);
  assert.match(html, /data-language="csharp"/);
  assert.match(html, /data-language="python"/);
  assert.match(html, /data-language="javascript"/);
});

test('the faded spans never break an HTML tag, even when a highlight token is split', () => {
  const html = createRenderer().render('~~~shadow\nx = "{{ghost}}ab{{/ghost}}"\n~~~\n');
  const opens = (html.match(/<span/g) || []).length;
  const closes = (html.match(/<\/span>/g) || []).length;
  assert.equal(opens, closes);
});
