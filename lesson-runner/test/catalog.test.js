// test/catalog.test.js
//
// Checks chapter and step discovery, the order a learner moves through them, and the real tutorial on disk.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { loadCatalog, flatten, summarize, neighbors } = require('../core/catalog');

const courseRoot = path.resolve(__dirname, '..', '..');

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function makeTempCourse() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-test-'));

  writeFile(path.join(root, 'ch01-first', 'lesson.md'), '# First Chapter\n\nIntro.\n');
  writeFile(
    path.join(root, 'ch01-first', '02-second', 'lesson.json'),
    JSON.stringify({ title: 'Second Step', minutes: 5, runtime: 'none' }),
  );
  writeFile(path.join(root, 'ch01-first', '02-second', 'lesson.md'), '# Second Step\n');
  writeFile(
    path.join(root, 'ch01-first', '01-first', 'lesson.json'),
    JSON.stringify({ title: 'First Step', minutes: 10, runtime: 'none' }),
  );
  writeFile(path.join(root, 'ch01-first', '01-first', 'lesson.md'), '# First Step\n');

  writeFile(path.join(root, 'ch02-next', 'lesson.md'), '## Not a title, so the folder name is used\n');
  writeFile(
    path.join(root, 'ch02-next', '01-only', 'lesson.json'),
    JSON.stringify({ title: 'Only Step', minutes: 3, runtime: 'none' }),
  );
  writeFile(path.join(root, 'ch02-next', '01-only', 'lesson.md'), '# Only Step\n');

  // Folders that are not chapters or steps are ignored.
  fs.mkdirSync(path.join(root, 'resources'));
  fs.mkdirSync(path.join(root, 'lesson-runner'));

  return root;
}

test('chapters and steps are found in folder-name order', () => {
  const root = makeTempCourse();
  const chapters = loadCatalog(root);

  assert.deepEqual(
    chapters.map((chapter) => chapter.id),
    ['ch01-first', 'ch02-next'],
  );
  assert.deepEqual(
    chapters[0].steps.map((step) => step.id),
    ['ch01-first/01-first', 'ch01-first/02-second'],
  );
});

test('a chapter title comes from its first heading, or from its folder name', () => {
  const chapters = loadCatalog(makeTempCourse());
  assert.equal(chapters[0].title, 'First Chapter');
  assert.equal(chapters[1].title, 'ch02-next');
});

test('flatten puts each chapter introduction before its steps', () => {
  const items = flatten(loadCatalog(makeTempCourse()));
  assert.deepEqual(
    items.map((item) => item.id),
    ['ch01-first', 'ch01-first/01-first', 'ch01-first/02-second', 'ch02-next', 'ch02-next/01-only'],
  );
  assert.equal(items[0].kind, 'chapter');
  assert.equal(items[1].kind, 'step');
});

test('Next crosses from the last step of one chapter into the next chapter', () => {
  const items = flatten(loadCatalog(makeTempCourse()));
  const { next } = neighbors(items, 'ch01-first/02-second');
  assert.equal(next.id, 'ch02-next');

  assert.equal(neighbors(items, 'ch02-next/01-only').next, null, 'the last step has no next');
  assert.equal(neighbors(items, 'ch01-first').previous, null, 'the first item has no previous');
  assert.deepEqual(neighbors(items, 'no-such-id'), { previous: null, next: null });
});

test('summarize leaves out file paths', () => {
  const summary = summarize(loadCatalog(makeTempCourse()));
  assert.equal(summary[0].steps[0].markdownPath, undefined);
  assert.equal(summary[0].steps[0].title, 'First Step');
});

test('summarize gives each chapter a label with its number', () => {
  const summary = summarize(loadCatalog(makeTempCourse()));
  assert.equal(summary[0].label, 'Ch01 - First Chapter');
  assert.equal(summary[1].label, 'Ch02 - ch02-next');
});

test('a step without lesson.json is reported with its path', () => {
  const root = makeTempCourse();
  fs.mkdirSync(path.join(root, 'ch01-first', '03-broken'));
  writeFile(path.join(root, 'ch01-first', '03-broken', 'lesson.md'), '# Broken\n');
  assert.throws(() => loadCatalog(root), /03-broken[\\/]lesson\.json|lesson\.json/);
});

test('a PowerShell step lists PowerShell as its language, and reads its expected output from sample.txt', () => {
  const root = makeTempCourse();
  writeFile(
    path.join(root, 'ch01-first', '03-script', 'lesson.json'),
    JSON.stringify({ title: 'A Script', minutes: 5, runtime: 'powershell' }),
  );
  writeFile(path.join(root, 'ch01-first', '03-script', 'lesson.md'), '# A Script\n');
  writeFile(path.join(root, 'ch01-first', '03-script', 'sample.txt'), 'Hello\n');
  const step = loadCatalog(root)[0].steps.find((candidate) => candidate.title === 'A Script');
  assert.deepEqual(step.languages, ['powershell']);
  assert.equal(step.expected, 'Hello\n');
});

test('the real tutorial has Chapter 1 with four steps, in order', () => {
  const chapters = loadCatalog(courseRoot);
  const chapter1 = chapters.find((chapter) => chapter.id === 'ch01-setting-up-your-terminal');
  assert.ok(chapter1, 'ch01-setting-up-your-terminal should exist');
  assert.deepEqual(
    chapter1.steps.map((step) => step.id.split('/')[1]),
    [
      '01-install-powershell-7',
      '02-make-powershell-7-the-default',
      '03-create-your-practice-folder',
      '04-summary',
    ],
  );
});

test('every step in the real tutorial has a title and a runtime', () => {
  for (const chapter of loadCatalog(courseRoot)) {
    for (const step of chapter.steps) {
      assert.ok(step.title, `${step.id} needs a title`);
      assert.ok(typeof step.runtime === 'string', `${step.id} needs a runtime`);
    }
  }
});
