// core/catalog.js
//
// Finds the course's chapters and steps on disk, and works out the order a learner moves through them.
// Chapters are folders named chNN-name at the course root. Each chapter has lesson.md (its introduction)
// and step folders named NN-name, each with lesson.json and lesson.md. Nothing here runs code.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CHAPTER_FOLDER = /^ch\d\d-/;
const STEP_FOLDER = /^\d\d-/;

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${file}: ${error.message}`);
  }
}

function firstHeading(markdown, fallback) {
  const match = /^#\s+(.+)$/m.exec(markdown);
  return match ? match[1].trim() : fallback;
}

// A PowerShell step runs in PowerShell 7 and has no other language choice. Its expected output is the text in sample.txt.
function stepLanguages(meta) {
  if (meta.runtime === 'powershell') return ['powershell'];
  return Array.isArray(meta.languages) ? meta.languages : [];
}

function stepExpected(stepDir, meta) {
  const sampleFile = path.join(stepDir, 'sample.txt');
  if (fs.existsSync(sampleFile)) return fs.readFileSync(sampleFile, 'utf8');
  return typeof meta.expected === 'string' ? meta.expected : null;
}

function stepExpectedFiles(stepDir) {
  const file = path.join(stepDir, 'expected-files.json');
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return parsed && typeof parsed.files === 'object' && parsed.files !== null ? parsed.files : null;
  } catch (error) {
    throw new Error(`Could not read ${file}: ${error.message}`);
  }
}

function listFolders(dir, pattern) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && pattern.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

// Returns the chapters in folder-name order. Each chapter lists its introduction and its steps.
function loadCatalog(courseRoot) {
  const chapters = [];

  for (const chapterFolder of listFolders(courseRoot, CHAPTER_FOLDER)) {
    const chapterDir = path.join(courseRoot, chapterFolder);
    const introPath = path.join(chapterDir, 'lesson.md');
    if (!fs.existsSync(introPath)) {
      throw new Error(`Chapter ${chapterFolder} has no lesson.md`);
    }

    const introMarkdown = fs.readFileSync(introPath, 'utf8');
    const steps = listFolders(chapterDir, STEP_FOLDER).map((stepFolder) => {
      const stepDir = path.join(chapterDir, stepFolder);
      const meta = readJson(path.join(stepDir, 'lesson.json'));
      return {
        id: `${chapterFolder}/${stepFolder}`,
        kind: 'step',
        title: meta.title,
        minutes: meta.minutes ?? null,
        objective: meta.objective ?? '',
        runtime: meta.runtime ?? 'none',
        spoiler: meta.spoiler === true,
        section: meta.section ?? null,
        dir: stepDir,
        languages: stepLanguages(meta),
        expected: stepExpected(stepDir, meta),
        expectedFiles: stepExpectedFiles(stepDir),
        markdownPath: path.join(stepDir, 'lesson.md'),
      };
    });

    chapters.push({
      id: chapterFolder,
      number: Number(chapterFolder.slice(2, 4)),
      title: firstHeading(introMarkdown, chapterFolder),
      introPath,
      steps,
    });
  }

  return chapters;
}

// Flattens the chapters into one list in the order a learner moves through them:
// each chapter's introduction, then its steps, then the next chapter.
function flatten(chapters) {
  const items = [];
  for (const chapter of chapters) {
    items.push({
      id: chapter.id,
      kind: 'chapter',
      title: chapter.title,
      chapterId: chapter.id,
      markdownPath: chapter.introPath,
    });
    for (const step of chapter.steps) {
      items.push({ ...step, chapterId: chapter.id });
    }
  }
  return items;
}

// The sidebar needs chapters with their steps, but not file paths. A chapter's label includes its number, as in
// "Ch00 - Introduction".
function summarize(chapters) {
  return chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    label: `Ch${String(chapter.number).padStart(2, '0')} - ${chapter.title}`,
    steps: chapter.steps.map((step) => ({
      id: step.id,
      title: step.title,
      runtime: step.runtime,
    })),
  }));
}

// Returns the items before and after the given id, or null at either end.
function neighbors(items, id) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}

module.exports = { loadCatalog, flatten, summarize, neighbors };
