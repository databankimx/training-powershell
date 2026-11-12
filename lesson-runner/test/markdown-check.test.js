// test/markdown-check.test.js
//
// Checks the rules the Markdown Check button depends on: equal output matches, different output doesn't, and raw
// HTML in a learner's source is escaped, not rendered.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { createRenderer, normalizeHtml } = require('../core/markdown');

const md = createRenderer();
const same = (a, b) => normalizeHtml(md.render(a)) === normalizeHtml(md.render(b));

test('a list with hyphens and a list with asterisks render the same', () => {
  assert.equal(same('- one\n- two\n', '* one\n* two\n'), true);
});

test('extra blank lines and trailing spaces do not change the rendering', () => {
  assert.equal(same('# Title\n\nText here.\n', '# Title   \n\n\n\nText here.   \n'), true);
});

test('italic and bold render differently, so they do not match', () => {
  assert.equal(same('*word*', '**word**'), false);
});

test('a missing list marker is a difference, so the list does not match', () => {
  assert.equal(same('- one\n- two\n', 'one\ntwo\n'), false);
});

test('raw HTML in the source is escaped, not rendered', () => {
  const html = md.render('<script>alert(1)</script>');
  assert.equal(html.includes('<script>'), false);
  assert.ok(html.includes('&lt;script&gt;'));
});

test('a line break inside a paragraph is the same as a space, wherever it falls', () => {
  assert.equal(same('We will ship on Friday\nif the tests pass.', 'We will ship on Friday if\nthe tests pass.'), true);
  assert.equal(same('We will ship on Friday\nif the tests pass.', 'We will ship on Friday if the tests pass.'), true);
});

test('a trailing space at the end of a source line does not change the rendering', () => {
  assert.equal(same('We will ship on Friday \nif the tests pass.', 'We will ship on Friday\nif the tests pass.'), true);
});

test('line breaks inside a code block are part of the code, so they still count', () => {
  assert.equal(same('```\na\nb\n```\n', '```\na b\n```\n'), false);
});

test('a rendered example is boxed and labeled, and its raw HTML is still escaped', () => {
  const html = md.render('~~~rendered\n**bold** <b>x</b>\n~~~\n');
  assert.ok(html.includes('class="rendered-example"'));
  assert.ok(html.includes('class="rendered-label">Rendered<'));
  assert.ok(html.includes('<strong>bold</strong>'));
  assert.equal(html.includes('<b>'), false);
});

test('normalizeHtml ignores line-ending differences', () => {
  assert.equal(normalizeHtml('<p>a</p>\r\n<p>b</p>'), normalizeHtml('<p>a</p>\n<p>b</p>'));
});
