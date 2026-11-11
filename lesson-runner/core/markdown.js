// core/markdown.js
//
// Renders lesson Markdown to HTML. Raw HTML in a lesson is turned off, so a lesson can't inject scripts.
// Four custom fenced blocks are supported:
//
//   ```quiz            one question, with choices marked ○ (wrong) or ◉ (right), each followed by → feedback
//   ~~~spoiler         a hidden example that the learner can show. A tilde fence lets it hold a code block.
//   ~~~examples        the same example in each course language, shown as tabs. It holds three fenced blocks,
//                      labelled csharp, python, and javascript.
//
//   ~~~shadow         code in which the text between {{ghost}} and {{/ghost}} is shown faded, like an editor's
//                      suggestion. The rest is shown normally. Used for completion and inline-edit examples.
// Everything the renderer adds is escaped, and the renderer attaches no inline scripts or handlers,
// because the page's Content Security Policy forbids them.

'use strict';

const MarkdownIt = require('markdown-it');
const { highlightCode } = require('./highlight');

// Private-use characters that mark the start and end of faded text. They pass through the highlighter untouched,
// and are turned into spans afterwards.
const GHOST_START = '\uE000';
const GHOST_END = '\uE001';

const WRONG = '○';
const RIGHT = '◉';
const FEEDBACK = '→';

// The languages a lesson's examples must cover, in tab order. The first one is the default.
const LANGUAGES = ['csharp', 'python', 'javascript'];
const LABELS = { csharp: 'C#', python: 'Python', javascript: 'JavaScript' };

// Splits a quiz block into its question and choices. A choice line starts with ○ or ◉. The line
// after it, if it starts with →, is the feedback for that choice.
function parseQuiz(source) {
  const lines = source.split('\n').map((line) => line.trimEnd());
  const questionLines = [];
  const choices = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;

    if (trimmed.startsWith(WRONG) || trimmed.startsWith(RIGHT)) {
      current = {
        text: trimmed.slice(1).trim(),
        correct: trimmed.startsWith(RIGHT),
        feedback: '',
      };
      choices.push(current);
    } else if (trimmed.startsWith(FEEDBACK)) {
      if (current) current.feedback = trimmed.slice(1).trim();
    } else if (choices.length === 0) {
      questionLines.push(trimmed);
    }
  }

  const errors = [];
  const correctCount = choices.filter((choice) => choice.correct).length;
  if (choices.length < 2) errors.push('a quiz needs at least two choices');
  if (correctCount !== 1) errors.push(`a quiz needs exactly one correct choice, found ${correctCount}`);

  return { question: questionLines.join(' '), choices, errors };
}

// Reads the three fenced blocks inside an examples block. The result maps each language to its code.
function parseExamples(source) {
  const variants = {};
  const pattern = /```([A-Za-z]+)\n([\s\S]*?)```/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    variants[match[1]] = match[2];
  }
  return variants;
}

// Returns the problems with an examples block: missing languages, and languages the course doesn't use.
function examplesErrors(source) {
  const variants = parseExamples(source);
  const missing = LANGUAGES.filter((language) => !(language in variants));
  const unknown = Object.keys(variants).filter((language) => !LANGUAGES.includes(language));
  const errors = [];
  if (missing.length > 0) errors.push(`missing ${missing.map((language) => LABELS[language]).join(', ')}`);
  if (unknown.length > 0) errors.push(`unknown language ${unknown.join(', ')}`);
  return errors;
}

let quizCounter = 0;

function renderQuiz(md, source) {
  const quiz = parseQuiz(source);
  const escape = md.utils.escapeHtml;
  const name = `quiz-${++quizCounter}`;

  if (quiz.errors.length > 0) {
    return `<div class="quiz quiz-error">${escape(`Quiz error: ${quiz.errors.join('; ')}.`)}</div>\n`;
  }

  const choices = quiz.choices
    .map(
      (choice) =>
        `<div class="quiz-choice" data-correct="${choice.correct ? 'true' : 'false'}">` +
        `<label><input type="radio" name="${name}"> <span>${escape(choice.text)}</span></label>` +
        `<div class="quiz-explain" hidden>${escape(choice.feedback)}</div>` +
        `</div>`,
    )
    .join('\n');

  return (
    `<div class="quiz" data-quiz>\n` +
    `<div class="quiz-question"><p>${escape(quiz.question)}</p></div>\n` +
    `<div class="quiz-choices">\n${choices}\n</div>\n` +
    `<div class="quiz-status" aria-live="polite"></div>\n` +
    `</div>\n`
  );
}

function renderSpoiler(md, source) {
  const body = md.render(source);
  return (
    `<div class="spoiler-example" data-spoiler>\n` +
    `<button type="button" class="spoiler-toggle" aria-expanded="false">Show example (spoiler)</button>\n` +
    `<div class="spoiler-body" hidden>\n${body}</div>\n` +
    `</div>\n`
  );
}

// The examples block shows one tab per language. The page shows the tab the learner chose, and it remembers the
// choice for every lesson.
function renderExamples(md, source) {
  const escape = md.utils.escapeHtml;
  const errors = examplesErrors(source);
  if (errors.length > 0) {
    return `<div class="quiz quiz-error">${escape(`Example error: ${errors.join('; ')}.`)}</div>\n`;
  }

  const variants = parseExamples(source);
  const tabs = LANGUAGES.map(
    (language) =>
      `<button type="button" class="language-tab" data-language="${language}">${escape(LABELS[language])}</button>`,
  ).join('');
  const panes = LANGUAGES.map((language) => {
    const code = variants[language];
    const body = code.includes('{{ghost}}')
      ? renderShadow(md, code, language)
      : md.render('```' + language + '\n' + code + '```\n');
    return `<div class="example-pane" data-language="${language}" hidden>\n${body}</div>`;
  }).join('\n');

  return `<div class="examples" data-examples>\n<div class="language-tabs">${tabs}</div>\n${panes}\n</div>\n`;
}

// Turns the private marker characters into faded spans. The highlighter's output is tags with text between them, so
// the text is split on the tags and each faded piece is wrapped inside a single run of text. A span never crosses a
// tag, so the HTML always stays balanced.
function fadeGhostText(html) {
  const parts = html.split(/(<[^>]+>)/);
  let ghost = false;
  let out = '';
  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      out += part;
      return;
    }
    for (const piece of part.split(/(\uE000|\uE001)/)) {
      if (piece === GHOST_START) {
        ghost = true;
      } else if (piece === GHOST_END) {
        ghost = false;
      } else if (piece !== '') {
        out += ghost ? `<span class="ghost">${piece}</span>` : piece;
      }
    }
  });
  return out;
}

// A shadow block: the typed code is normal, and the suggestion is faded. With a language, the code is colored, and the
// faded parts keep their colors.
function renderShadow(md, source, language) {
  const marked = source.replace(/\{\{ghost\}\}/g, GHOST_START).replace(/\{\{\/ghost\}\}/g, GHOST_END);
  const body = language ? highlightCode(marked, language) : md.utils.escapeHtml(marked);
  return `<pre class="shadow"><code>${fadeGhostText(body)}</code></pre>\n`;
}

// Renders a rendered-example block: the Markdown inside is shown as it would display, in a labeled, bordered box, so the
// example and its output are visibly separate. The inside is rendered with the same settings, so raw HTML is still escaped.
function renderRenderedExample(md, source) {
  return (
    `<div class="rendered-example" data-rendered-example>\n` +
    `<div class="rendered-label">Rendered</div>\n` +
    md.render(source) +
    `</div>\n`
  );
}

function createRenderer(options = {}) {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false, highlight: options.highlight || null });
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const info = (token.info || '').trim();
    if (info === 'quiz') return renderQuiz(md, token.content);
    if (info === 'spoiler') return renderSpoiler(md, token.content);
    if (info === 'examples') return renderExamples(md, token.content);
    if (info === 'shadow') return renderShadow(md, token.content);
    if (info === 'rendered') return renderRenderedExample(md, token.content);
    return defaultFence(tokens, index, options, env, self);
  };

  return md;
}

// Normalizes rendered HTML so that two sources which show the same thing compare equal. A line break inside a paragraph
// displays as a space, so it is treated as one. Line breaks inside code blocks are part of the code, so they are kept.
// Whitespace between tags and runs of spaces are collapsed.
function normalizeHtml(html) {
  const text = String(html).replace(/\r\n?/g, '\n');
  // The split keeps each <pre> block as its own part, at odd indexes. Other parts are the prose.
  const flattened = text
    .split(/(<pre[\s\S]*?<\/pre>)/)
    .map((part, index) => (index % 2 === 1 ? part : part.replace(/\n/g, ' ')))
    .join('');
  return flattened
    .replace(/>\s+</g, '><')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

module.exports = { createRenderer, parseQuiz, parseExamples, examplesErrors, normalizeHtml, LANGUAGES };
