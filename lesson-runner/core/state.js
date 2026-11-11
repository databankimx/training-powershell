// core/state.js
//
// Saves the learner's progress: the step they were on, the steps they have visited, each lesson's quiz answers and
// spoiler states, and which code steps have had their solutions revealed. The file lives in the user data folder,
// never in the repository. Drafts are not saved.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

function emptyState() {
  return { lastStep: null, visited: [], lessons: {}, solutions: {} };
}

function emptyLessonProgress() {
  return { quizzes: {}, spoilers: {} };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Keeps only well-formed entries: a quiz answer is a choice number, and a spoiler state is true or false.
function cleanLessons(value) {
  const lessons = {};
  if (!isPlainObject(value)) return lessons;
  for (const [id, entry] of Object.entries(value)) {
    if (!isPlainObject(entry)) continue;
    const progress = emptyLessonProgress();
    if (isPlainObject(entry.quizzes)) {
      for (const [key, chosen] of Object.entries(entry.quizzes)) {
        if (Number.isInteger(chosen) && chosen >= 0) progress.quizzes[key] = chosen;
      }
    }
    if (isPlainObject(entry.spoilers)) {
      for (const [key, open] of Object.entries(entry.spoilers)) {
        if (typeof open === 'boolean') progress.spoilers[key] = open;
      }
    }
    lessons[id] = progress;
  }
  return lessons;
}

// Only a reveal that was actually saved as true counts.
function cleanSolutions(value) {
  const solutions = {};
  if (!isPlainObject(value)) return solutions;
  for (const [id, revealed] of Object.entries(value)) {
    if (revealed === true) solutions[id] = true;
  }
  return solutions;
}

// A missing or damaged file gives an empty state, so the runner always starts.
function loadState(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return {
      lastStep: typeof data.lastStep === 'string' ? data.lastStep : null,
      visited: Array.isArray(data.visited) ? data.visited.filter((id) => typeof id === 'string') : [],
      lessons: cleanLessons(data.lessons),
      solutions: cleanSolutions(data.solutions),
    };
  } catch {
    return emptyState();
  }
}

function saveState(file, state) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf8');
}

// Records that the learner reached a step. Nothing is marked as passed, because the course has no pass or fail.
function markVisited(state, id) {
  const visited = state.visited.includes(id) ? state.visited : [...state.visited, id];
  return { ...state, lastStep: id, visited };
}

// Records one quiz answer (kind 'quiz', value = the chosen choice's number) or one spoiler's open state (kind
// 'spoiler', value = true or false). The index counts the quizzes or spoilers in the lesson, from the top.
function recordProgress(state, lessonId, kind, index, value) {
  const lessons = { ...state.lessons };
  const current = lessons[lessonId] ?? emptyLessonProgress();
  const next = { quizzes: { ...current.quizzes }, spoilers: { ...current.spoilers } };
  if (kind === 'quiz') {
    next.quizzes[String(index)] = value;
  } else {
    next.spoilers[String(index)] = value;
  }
  lessons[lessonId] = next;
  return { ...state, lessons };
}

function lessonProgress(state, lessonId) {
  return state.lessons[lessonId] ?? emptyLessonProgress();
}

// Opening a code step's solutions is kept, so the gate stays open on the next run.
function recordSolutionsRevealed(state, lessonId) {
  return { ...state, solutions: { ...state.solutions, [lessonId]: true } };
}

function solutionsRevealed(state, lessonId) {
  return state.solutions[lessonId] === true;
}

module.exports = {
  emptyState,
  loadState,
  saveState,
  markVisited,
  recordProgress,
  lessonProgress,
  recordSolutionsRevealed,
  solutionsRevealed,
};
