// test/markdown.test.js
//
// Checks quiz parsing and rendering, the spoiler block, escaping, and that every quiz in the real course
// has exactly one correct choice. The last check is the course's lesson test for quizzes.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { createRenderer, parseQuiz, examplesErrors } = require('../core/markdown');
const { loadCatalog } = require('../core/catalog');

const courseRoot = path.resolve(__dirname, '..', '..');

test('parseQuiz reads the question, the choices, and the feedback', () => {
  const quiz = parseQuiz(
    [
      'What does a semicolon do?',
      '○ It makes text bold.',
      '→ Not quite.',
      '◉ It ends an instruction.',
      '→ Right.',
    ].join('\n'),
  );

  assert.equal(quiz.question, 'What does a semicolon do?');
  assert.equal(quiz.choices.length, 2);
  assert.equal(quiz.choices[0].correct, false);
  assert.equal(quiz.choices[0].feedback, 'Not quite.');
  assert.equal(quiz.choices[1].correct, true);
  assert.equal(quiz.choices[1].text, 'It ends an instruction.');
  assert.deepEqual(quiz.errors, []);
});

test('a quiz with no correct choice, or two, is reported as an error', () => {
  const none = parseQuiz('Question?\n○ A\n→ no\n○ B\n→ no');
  assert.ok(none.errors.some((error) => error.includes('found 0')));

  const two = parseQuiz('Question?\n◉ A\n→ yes\n◉ B\n→ yes');
  assert.ok(two.errors.some((error) => error.includes('found 2')));
});

test('a quiz with fewer than two choices is reported', () => {
  const quiz = parseQuiz('Question?\n◉ Only one\n→ Right.');
  assert.ok(quiz.errors.some((error) => error.includes('at least two')));
});

test('a quiz block renders as radio choices with hidden feedback', () => {
  const md = createRenderer();
  const html = md.render('```quiz\nPick one.\n○ Wrong\n→ Not quite.\n◉ Right\n→ Right.\n```\n');

  assert.match(html, /class="quiz" data-quiz/);
  assert.match(html, /data-correct="true"/);
  assert.match(html, /data-correct="false"/);
  assert.match(html, /type="radio"/);
  assert.match(html, /class="quiz-explain" hidden>Right\./);
});

test('a broken quiz renders a visible error, not a quiz', () => {
  const md = createRenderer();
  const html = md.render('```quiz\nBroken?\n○ A\n→ no\n○ B\n→ no\n```\n');
  assert.match(html, /quiz-error/);
  assert.doesNotMatch(html, /type="radio"/);
});

test('a spoiler block renders a hidden body with a toggle', () => {
  const md = createRenderer();
  const html = md.render('```spoiler\nHere is one way.\n```\n');

  assert.match(html, /data-spoiler/);
  assert.match(html, /class="spoiler-toggle"/);
  assert.match(html, /class="spoiler-body" hidden>/);
  assert.match(html, /Here is one way\./);
});

test('a tilde spoiler can hold a code block, such as a prompt', () => {
  const md = createRenderer();
  const html = md.render('~~~spoiler\nHere is one way.\n\n```text\nA prompt.\n```\n~~~\n');

  assert.match(html, /data-spoiler/);
  assert.match(html, /class="spoiler-body" hidden>/);
  assert.match(html, /<pre><code class="language-text">A prompt\./);
});

test('raw HTML in a lesson is escaped, not rendered', () => {
  const md = createRenderer();
  const html = md.render('Hello <script>alert(1)</script>\n\n<img src=x onerror=alert(1)>');
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img/);
});

test('quiz text is escaped', () => {
  const md = createRenderer();
  const html = md.render('```quiz\nWhat is <b>this</b>?\n○ <i>no</i>\n→ x\n◉ yes\n→ y\n```\n');
  assert.doesNotMatch(html, /<b>this<\/b>/);
  assert.match(html, /&lt;b&gt;this&lt;\/b&gt;/);
});

test('an examples block renders one pane per language, with tabs', () => {
  const md = createRenderer();
  const html = md.render(
    '~~~examples\n```csharp\nConsole.WriteLine(1);\n```\n```python\nprint(1)\n```\n```javascript\nconsole.log(1);\n```\n~~~\n',
  );
  assert.match(html, /data-examples/);
  assert.match(html, /data-language="csharp"/);
  assert.match(html, /data-language="python"/);
  assert.match(html, /data-language="javascript"/);
  assert.match(html, /<pre><code class="language-python">print\(1\)/);
});

test('an examples block missing a language is reported as an error', () => {
  const md = createRenderer();
  const html = md.render('~~~examples\n```csharp\nx\n```\n```python\ny\n```\n~~~\n');
  assert.match(html, /quiz-error/);
  assert.match(html, /missing JavaScript/);
});

test('every examples block in the real course has all three languages', () => {
  const failures = [];
  for (const chapter of loadCatalog(courseRoot)) {
    const files = [chapter.introPath, ...chapter.steps.map((step) => step.markdownPath)];
    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, 'utf8');
      const blocks = text.match(/~~~examples\n[\s\S]*?~~~/g) || [];
      for (const block of blocks) {
        const errors = examplesErrors(block.replace(/^~~~examples\n/, '').replace(/~~~$/, ''));
        if (errors.length > 0) failures.push(`${file}: ${errors.join('; ')}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('ordinary code fences still render as code', () => {
  const md = createRenderer();
  const html = md.render('```python\nprint("hi")\n```\n');
  assert.match(html, /<pre><code class="language-python">/);
});

test('every quiz in the real course has exactly one correct choice', () => {
  const failures = [];
  for (const chapter of loadCatalog(courseRoot)) {
    const files = [chapter.introPath, ...chapter.steps.map((step) => step.markdownPath)];
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      const blocks = text.match(/```quiz\n([\s\S]*?)```/g) || [];
      for (const block of blocks) {
        const body = block.replace(/^```quiz\n/, '').replace(/```$/, '');
        const quiz = parseQuiz(body);
        if (quiz.errors.length > 0) failures.push(`${file}: ${quiz.errors.join('; ')}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
