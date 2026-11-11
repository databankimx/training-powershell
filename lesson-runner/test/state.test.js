// test/state.test.js
//
// Checks progress saving: a missing or damaged file must never stop the runner from starting, and quiz answers,
// spoiler states, and solution reveals must come back exactly as they were saved.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  emptyState,
  loadState,
  saveState,
  markVisited,
  recordProgress,
  lessonProgress,
  recordSolutionsRevealed,
  solutionsRevealed,
} = require('../core/state');

function tempFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'state-test-'));
  return path.join(dir, 'nested', 'progress.json');
}

test('a missing file gives an empty state', () => {
  assert.deepEqual(loadState(tempFile()), emptyState());
});

test('a damaged file gives an empty state', () => {
  const file = tempFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '{ not json', 'utf8');
  assert.deepEqual(loadState(file), emptyState());
});

test('the state round-trips through the file, creating folders as needed', () => {
  const file = tempFile();
  const state = markVisited(emptyState(), 'ch00-introduction/01-what-an-assistant-does');
  saveState(file, state);
  assert.deepEqual(loadState(file), state);
});

test('markVisited records the last step and does not repeat a visited step', () => {
  let state = markVisited(emptyState(), 'a');
  state = markVisited(state, 'b');
  state = markVisited(state, 'a');
  assert.equal(state.lastStep, 'a');
  assert.deepEqual(state.visited, ['a', 'b']);
});

test('invalid visited and lastStep fields in the file are ignored', () => {
  const file = tempFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ lastStep: 42, visited: ['ok', 7] }), 'utf8');
  assert.deepEqual(loadState(file), { lastStep: null, visited: ['ok'], lessons: {}, solutions: {} });
});

test('a quiz answer and a spoiler state are saved per lesson and come back after a restart', () => {
  const file = tempFile();
  let state = recordProgress(emptyState(), 'ch00-introduction/06-summary', 'quiz', 0, 2);
  state = recordProgress(state, 'ch00-introduction/05-confidential-data', 'spoiler', 0, true);
  saveState(file, state);

  const reloaded = loadState(file);
  assert.deepEqual(lessonProgress(reloaded, 'ch00-introduction/06-summary'), {
    quizzes: { 0: 2 },
    spoilers: {},
  });
  assert.deepEqual(lessonProgress(reloaded, 'ch00-introduction/05-confidential-data'), {
    quizzes: {},
    spoilers: { 0: true },
  });
});

test('a later answer to the same quiz replaces the earlier one', () => {
  let state = recordProgress(emptyState(), 'lesson', 'quiz', 1, 0);
  state = recordProgress(state, 'lesson', 'quiz', 1, 2);
  assert.deepEqual(lessonProgress(state, 'lesson').quizzes, { 1: 2 });
});

test('a lesson with nothing saved has empty progress', () => {
  assert.deepEqual(lessonProgress(emptyState(), 'nothing-here'), { quizzes: {}, spoilers: {} });
});

test('malformed saved progress is dropped when the file is read', () => {
  const file = tempFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    JSON.stringify({
      lessons: {
        good: { quizzes: { 0: 1 }, spoilers: { 0: false } },
        bad: { quizzes: { 0: 'two' }, spoilers: { 0: 'yes' } },
        notAnObject: 5,
      },
    }),
    'utf8',
  );
  const state = loadState(file);
  assert.deepEqual(lessonProgress(state, 'good'), { quizzes: { 0: 1 }, spoilers: { 0: false } });
  assert.deepEqual(lessonProgress(state, 'bad'), { quizzes: {}, spoilers: {} });
  assert.equal(state.lessons.notAnObject, undefined);
});

test('a solution reveal stays open across runs, and only a saved true counts', () => {
  const file = tempFile();
  saveState(file, recordSolutionsRevealed(emptyState(), 'ch01-first-interaction/02-let-the-assistant-finish'));
  const reloaded = loadState(file);
  assert.equal(solutionsRevealed(reloaded, 'ch01-first-interaction/02-let-the-assistant-finish'), true);
  assert.equal(solutionsRevealed(reloaded, 'ch01-first-interaction/03-read-before-accepting'), false);

  fs.writeFileSync(file, JSON.stringify({ solutions: { someStep: 'yes', otherStep: true } }), 'utf8');
  assert.deepEqual(loadState(file).solutions, { otherStep: true });
});
