// renderer/renderer.js
//
// The window's UI. It builds the chapter and lesson lists, shows the Lesson and Source tabs, handles quiz answers
// and spoiler examples, runs code, gates the solutions, opens links in the browser, and moves between lessons with
// the Next and Previous buttons and the keyboard. It talks to the main process only through window.runner
// (see preload.js). This is a classic script: the page's Content Security Policy allows scripts from 'self' only.

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const isPopout = params.get('mode') === 'lesson';
  const startLesson = params.get('lesson');
  const LANGUAGES = ['powershell', 'csharp', 'python', 'javascript'];
  const LABELS = { powershell: 'PowerShell', csharp: 'C#', python: 'Python', javascript: 'JavaScript' };
  // The file extension for each language's main file: main.cs, main.py, and main.js.
  const EXTENSIONS = { powershell: 'ps1', csharp: 'cs', python: 'py', javascript: 'js' };

  const ui = {
    chapters: document.getElementById('chapters'),
    lessons: document.getElementById('lessons'),
    title: document.getElementById('title'),
    lesson: document.getElementById('lesson'),
    source: document.getElementById('source'),
    sourceLanguages: document.getElementById('source-languages'),
    fileSelect: document.getElementById('file-select'),
    promptView: document.getElementById('prompt-view'),
    editor: document.getElementById('editor'),
    highlight: document.getElementById('highlight'),
    gutter: document.getElementById('gutter'),
    solutionGutter: document.getElementById('solution-gutter'),
    solutions: document.getElementById('solutions'),
    solutionCode: document.getElementById('solution-code'),
    solutionReasoning: document.getElementById('solution-reasoning'),
    solutionsToggle: document.getElementById('solutions-toggle'),
    resetSource: document.getElementById('reset-source'),
    modified: document.getElementById('modified'),
    noCode: document.getElementById('no-code'),
    noToolchain: document.getElementById('no-toolchain'),
    output: document.getElementById('output'),
    rendered: document.getElementById('rendered'),
    markdownCheck: document.getElementById('markdown-check'),
    outputLabel: document.getElementById('output-label'),
    run: document.getElementById('run'),
    stopRun: document.getElementById('stop-run'),
    check: document.getElementById('check'),
    previous: document.getElementById('previous'),
    previousHint: document.getElementById('previous-hint'),
    next: document.getElementById('next'),
    nextHint: document.getElementById('next-hint'),
    theme: document.getElementById('theme'),
    toast: document.getElementById('toast'),
    redock: document.getElementById('redock'),
  };

  const state = {
    catalog: [],
    current: null,
    chapterId: null,
    previous: null,
    next: null,
    popoutOpen: false,
    lessonSize: 14,
    toolchains: null,
    // The code step on screen: its languages, the starter and any edits in each, the active language, and the
    // solution gate. Edits last only while the learner is on the step, as the design says.
    code: null,
    running: false,
  };
  const scrollPositions = new Map();
  // True while saved answers are being put back, so restoring them doesn't save them again.
  let restoring = false;

  // ---- Glyphs, theme, and zoom ----

  function setupGlyphs() {
    document.getElementById('moon').innerHTML = window.icon('moon', 16);
    document.getElementById('sun').innerHTML = window.icon('sun', 16);
    document.getElementById('copy-output').innerHTML = window.icon('copy');
    document.getElementById('clear').innerHTML = window.icon('clear');
    document.getElementById('copy-source').innerHTML = window.icon('copy');
    document.getElementById('popout').innerHTML = window.icon('popout');
    document.getElementById('popout-copy').innerHTML = window.icon('copy');
    document.getElementById('popout-dock').innerHTML = window.icon('dock');
    document.getElementById('previous-icon').innerHTML = window.icon('triangle-left', 16);
    document.getElementById('next-icon').innerHTML = window.icon('triangle-right', 16);
    document.getElementById('run-icon').innerHTML = window.icon('triangle-right', 12);
  }

  function applyTheme(light) {
    document.body.classList.toggle('light', light);
    ui.theme.checked = light;
    localStorage.setItem('theme', light ? 'light' : 'dark');
  }

  function setupTheme() {
    applyTheme(localStorage.getItem('theme') === 'light');
    ui.theme.addEventListener('change', () => applyTheme(ui.theme.checked));
  }

  // Ctrl with the mouse wheel changes the lesson's text size. The page itself never zooms.
  function setupZoom() {
    document.addEventListener(
      'wheel',
      (event) => {
        if (!event.ctrlKey) return;
        event.preventDefault();
        if (!ui.lesson.contains(event.target)) return;
        state.lessonSize = Math.min(28, Math.max(10, state.lessonSize + (event.deltaY < 0 ? 1 : -1)));
        document.documentElement.style.setProperty('--lesson-size', `${state.lessonSize}px`);
      },
      { passive: false },
    );
  }

  // ---- Messages ----

  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.remove('hidden');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => ui.toast.classList.add('hidden'), 2500);
  }

  function appendOutput(text, className) {
    const span = document.createElement('span');
    if (className) span.className = className;
    span.textContent = text;
    ui.output.append(span);
    ui.output.scrollTop = ui.output.scrollHeight;
  }

  // Shows a tick in place of a copy glyph for a moment, so the learner knows the copy worked.
  function copyText(text, button) {
    navigator.clipboard.writeText(text).catch(() => showToast('The text could not be copied.'));
    if (!button) return;
    const original = button.innerHTML;
    button.innerHTML = window.icon('checkmark');
    window.setTimeout(() => {
      button.innerHTML = original;
    }, 1200);
  }

  // ---- Languages: one choice, shared by the examples in the lesson and the tabs in the source ----

  function currentLanguage() {
    const saved = localStorage.getItem('language');
    return LANGUAGES.includes(saved) ? saved : 'powershell';
  }

  function chooseLanguage(language) {
    localStorage.setItem('language', language);
  }

  // Shows the chosen language's example in every examples block on the page.
  function applyLanguage(language) {
    for (const block of ui.lesson.querySelectorAll('[data-examples]')) {
      for (const tab of block.querySelectorAll('.language-tab')) {
        tab.classList.toggle('active', tab.dataset.language === language);
      }
      for (const pane of block.querySelectorAll('.example-pane')) {
        pane.hidden = pane.dataset.language !== language;
      }
    }
  }

  // ---- Tabs ----

  // Steps without code open on the Lesson tab. A code step opens on the Source tab.
  function showTab(name) {
    for (const button of document.querySelectorAll('.tab')) {
      button.classList.toggle('active', button.dataset.tab === name);
    }
    if (name === 'lesson' && state.current) {
      ui.lesson.scrollTop = scrollPositions.get(state.current.id) || 0;
    }
    refreshPaneVisibility();
  }

  // While the lesson is open in its own window, the Lesson tab shows a Re-dock panel. The Source tab stays usable.
  function refreshPaneVisibility() {
    const tab = activeTab();
    const redock = !isPopout && state.popoutOpen && tab === 'lesson';
    ui.redock.classList.toggle('hidden', !redock);
    ui.lesson.classList.toggle('hidden', redock || tab !== 'lesson');
    ui.source.classList.toggle('hidden', tab !== 'source');
  }

  function activeTab() {
    const active = document.querySelector('.tab.active');
    return active && active.dataset.tab === 'lesson' ? 'lesson' : 'source';
  }

  function setupTabs() {
    for (const button of document.querySelectorAll('.tab')) {
      button.addEventListener('click', () => showTab(button.dataset.tab));
    }
  }

  // ---- Source: the code of a step, with language tabs, an editor, Run, and the solution gate ----

  // Loads the toolchains once. A language whose tools are missing gets no tab.
  async function loadToolchains() {
    if (state.toolchains !== null) return;
    try {
      state.toolchains = await window.runner.toolchains();
    } catch (error) {
      state.toolchains = {};
      showToast(`The installed languages could not be checked: ${error.message}`);
    }
  }

  // Colors the editor's text. Each call supersedes the one before, so a slow result can't overwrite a newer one.
  let highlightSeq = 0;

  // One line number per line of text, from 1 to the last line.
  function lineNumbers(text) {
    return Array.from({ length: text.split('\n').length }, (_item, index) => String(index + 1)).join('\n');
  }

  async function refreshHighlight() {
    const code = state.code;
    // The prompt is shown rendered and read-only, so only the main file is colored.
    const language = code === null ? null : code.file === 'prompt' ? null : code.active;
    ui.gutter.textContent = language === null ? '' : lineNumbers(ui.editor.value);
    if (language === null) {
      ui.highlight.innerHTML = '';
      return;
    }
    const seq = ++highlightSeq;
    try {
      const html = await window.runner.highlight(ui.editor.value, language);
      if (seq === highlightSeq) {
        ui.highlight.innerHTML = html + '\n';
        syncHighlightScroll();
      }
    } catch {
      // Without coloring the text is still shown, so a failed highlight is not reported.
    }
  }

  // The coloring layer follows the editor's scroll position, so the two line up.
  function syncHighlightScroll() {
    ui.highlight.scrollTop = ui.editor.scrollTop;
    ui.highlight.scrollLeft = ui.editor.scrollLeft;
    ui.gutter.scrollTop = ui.editor.scrollTop;
  }

  // Shows the read-only solution for the active language, colored the same way.
  async function showSolution(code) {
    const text = code.active && code.solutions ? (code.solutions[code.active] ?? '') : '';
    ui.solutionGutter.textContent = lineNumbers(text);
    const seq = ++highlightSeq;
    try {
      const html = await window.runner.highlight(text, code.active || '');
      if (seq === highlightSeq) ui.solutionCode.innerHTML = html;
    } catch {
      ui.solutionCode.textContent = text;
    }
  }

  // The file drop-down: the step's main file for the active language, and prompt.md when the step has one.
  function renderFileSelect() {
    const code = state.code;
    ui.fileSelect.hidden = code === null || code.prompt === null;
    if (code === null) return;
    const mainName = code.active ? `main.${EXTENSIONS[code.active]}` : 'main';
    const options = [['code', mainName]];
    if (code.prompt !== null) options.push(['prompt', 'prompt.md']);
    ui.fileSelect.replaceChildren(
      ...options.map(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        option.selected = value === code.file;
        return option;
      }),
    );
  }

  // The text under edit is kept per file: the main file for each language, and prompt.md.
  function editKey() {
    const code = state.code;
    if (code === null) return null;
    return code.file === 'prompt' ? 'prompt' : code.active;
  }

  function saveEditorText() {
    const key = editKey();
    if (state.code !== null && key !== null && !ui.editor.hidden) state.code.edits[key] = ui.editor.value;
  }

  // Moves between main.* and prompt.md. Viewing the prompt closes the solutions, which belong to the main file.
  function selectFile(file) {
    const code = state.code;
    if (code === null || code.file === file) return;
    saveEditorText();
    code.file = file;
    renderFileSelect();
    renderSourceTabs();
    showCode();
  }

  function canRun(language) {
    return Boolean(state.toolchains && state.toolchains[language] && state.toolchains[language].available);
  }

  function setRunButtonsVisible(visible) {
    ui.run.hidden = !visible;
    ui.stopRun.hidden = !visible;
    ui.check.hidden = !visible;
  }

  // Switches the output pane between console output (code steps) and the rendered result (Markdown steps).
  function setOutputMode(markdown) {
    ui.output.hidden = markdown;
    ui.rendered.hidden = !markdown;
    ui.markdownCheck.hidden = !markdown;
    ui.outputLabel.textContent = markdown ? 'RENDERED' : 'OUTPUT';
  }

  // Renders the learner's Markdown in the output pane, with the lesson renderer in the main process.
  async function renderRendered(source) {
    try {
      ui.rendered.innerHTML = await window.runner.markdownRender(source);
      decorateCodeBlocks(ui.rendered);
    } catch (error) {
      ui.rendered.textContent = error.message;
    }
  }

  // A Markdown step has one source pane (the raw Markdown), and the output pane shows the rendered result.
  function renderMarkdownStep(lesson) {
    const starter = normalizeLineEndings(lesson.markdownStarter || '');
    ui.noCode.hidden = true;
    ui.noToolchain.hidden = true;
    ui.sourceLanguages.replaceChildren();
    ui.sourceLanguages.hidden = true;
    ui.solutionsToggle.hidden = !lesson.hasSample;
    ui.resetSource.hidden = false;
    ui.modified.hidden = true;
    setRunButtonsVisible(false);
    ui.promptView.hidden = true;
    ui.solutions.hidden = true;
    state.code = {
      id: lesson.id,
      file: 'code',
      prompt: null,
      languages: ['markdown'],
      starters: { markdown: starter },
      edits: { markdown: starter },
      active: 'markdown',
      solutionsRevealed: lesson.solutionsRevealed,
      solutions: null,
      solutionsOpen: false,
      markdown: true,
    };
    renderFileSelect();
    setOutputMode(true);
    ui.markdownCheck.hidden = true;
    showCode();
    renderRendered(starter);
  }

  // Shows the result of a Markdown check above the rendered text. A problem is shown in the error style.
  function showMarkdownCheck(text, kind) {
    ui.markdownCheck.textContent = text;
    ui.markdownCheck.className = kind === 'error' ? 'mismatch-hint' : 'status-hint';
    ui.markdownCheck.hidden = false;
  }

  // A Markdown step updates its rendered page and its check as the learner types, after a short pause.
  let markdownTimer = null;
  function scheduleMarkdownUpdate() {
    window.clearTimeout(markdownTimer);
    markdownTimer = window.setTimeout(() => {
      const code = state.code;
      if (code === null || !code.markdown || code.solutionsOpen) return;
      renderRendered(ui.editor.value);
      checkMarkdownStep();
    }, 300);
  }

  // Clears what the previous lesson left in the Markdown panes: a pending update, the rendered page, and the check.
  function clearMarkdownPanes() {
    window.clearTimeout(markdownTimer);
    markdownTimer = null;
    ui.rendered.innerHTML = '';
    ui.markdownCheck.hidden = true;
    ui.markdownCheck.textContent = '';
  }

  // Shows the Rendered pane for a Markdown step: the solution while it's open, otherwise the learner's own source.
  // The check message is hidden while the solution shows, because the solution is not the learner's work.
  function syncMarkdownPreview() {
    const code = state.code;
    if (code === null || !code.markdown) return;
    if (code.solutionsOpen && code.solutions) {
      renderRendered(code.solutions.markdown);
      ui.markdownCheck.hidden = true;
    } else {
      renderRendered(ui.editor.value);
      checkMarkdownStep();
    }
  }

  async function checkMarkdownStep() {
    const code = state.code;
    const source = code.solutionsOpen && code.solutions ? code.solutions.markdown : ui.editor.value;
    try {
      const result = await window.runner.markdownCheck(state.current.id, source);
      if (result.kind === 'passed') {
        showMarkdownCheck('Check passed: the rendered output matches the sample.', 'status');
      } else if (result.kind === 'no-sample') {
        showMarkdownCheck('This step has no sample to check against. Compare your result with the lesson text.', 'status');
      } else {
        showMarkdownCheck(
          result.hint ? `Not yet. ${result.hint}` : 'Not yet. The rendered output does not match what the step asks for.',
          'error',
        );
      }
    } catch (error) {
      showMarkdownCheck(error.message, 'error');
    }
  }

  // Sets up the Source tab for a lesson. A step without code shows a note, and a code step shows its editor.
  async function renderSource(lesson) {
    setOutputMode(lesson.markdownStep === true);
    if (lesson.markdownStep) {
      renderMarkdownStep(lesson);
      return;
    }
    const hasCode = lesson.languages.length > 0;
    ui.noCode.hidden = hasCode;
    ui.noToolchain.hidden = true;
    ui.sourceLanguages.replaceChildren();
    ui.solutionsToggle.hidden = !hasCode;
    ui.resetSource.hidden = !hasCode;
    ui.check.title = lesson.hasFileCheck
      ? 'Check (Ctrl+F5). Empties the practice folder first, then runs your script.'
      : 'Check (Ctrl+F5)';
    ui.modified.hidden = true;
    setRunButtonsVisible(hasCode);
    ui.editor.hidden = true;
    ui.promptView.hidden = true;
    ui.solutions.hidden = true;
    if (!hasCode) {
      state.code = null;
      renderFileSelect();
      ui.noCode.textContent = 'This step has no source code.';
      return;
    }

    const edits = {};
    for (const language of lesson.languages) {
      edits[language] = normalizeLineEndings(lesson.starters[language] ?? '');
    }
    if (lesson.prompt !== null) edits.prompt = lesson.prompt;
    state.code = {
      id: lesson.id,
      file: 'code',
      prompt: lesson.prompt,
      languages: lesson.languages,
      starters: lesson.starters,
      edits,
      active: null,
      solutionsRevealed: lesson.solutionsRevealed,
      solutions: null,
      solutionsOpen: false,
    };
    ui.noCode.textContent = '';
    renderFileSelect();

    await loadToolchains();
    // The lesson may have changed while the toolchains were being checked, so the step is checked again first.
    if (state.code === null || state.code.id !== lesson.id) return;
    renderSourceTabs();
    showCode();
  }

  // The language tabs. Normally only languages that can run here get a tab. Once the solutions are open, all of
  // the step's languages get a tab, so every sample can be read.
  function renderSourceTabs() {
    const code = state.code;
    if (code === null) return;
    if (code.markdown) {
      ui.sourceLanguages.hidden = true;
      ui.noToolchain.hidden = true;
      return;
    }
    const choices = code.languages.filter((language) => code.solutionsOpen || canRun(language));
    // The language tabs choose the main file, so they're hidden while the prompt is showing.
    ui.sourceLanguages.hidden = code.file === 'prompt';
    if (code.file === 'prompt') {
      ui.noToolchain.hidden = true;
      return;
    }

    ui.sourceLanguages.replaceChildren(
      ...choices.map((language) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'language-tab';
        tab.dataset.language = language;
        tab.textContent = LABELS[language];
        tab.addEventListener('click', () => selectLanguage(language));
        return tab;
      }),
    );

    if (choices.length === 0) {
      ui.noToolchain.textContent =
        'None of this step\'s languages can run on this computer. Install the tools for one of them, then open the step again.';
      ui.noToolchain.hidden = false;
      code.active = null;
      return;
    }
    ui.noToolchain.hidden = true;
    const preferred = currentLanguage();
    // Keep the language being edited. Only choose a default when there isn't one yet, or it's no longer available.
    if (!choices.includes(code.active)) code.active = choices.includes(preferred) ? preferred : choices[0];
    for (const tab of ui.sourceLanguages.querySelectorAll('.language-tab')) {
      tab.classList.toggle('active', tab.dataset.language === code.active);
    }
  }

  // Shows either the editor for the active language, or the read-only solutions once they are open.
  function showCode() {
    const code = state.code;
    if (code === null) return;
    ui.solutionsToggle.textContent = code.solutionsOpen
      ? 'Hide solutions'
      : code.solutionsRevealed
        ? 'Show solutions'
        : 'Show solutions (spoiler)';
    ui.solutionsToggle.setAttribute('aria-expanded', String(code.solutionsOpen));

    if (code.solutionsOpen && code.file !== 'prompt') {
      ui.editor.hidden = true;
      ui.solutions.hidden = false;
      showSolution(code);
      ui.promptView.hidden = true;
      ui.modified.hidden = true;
      ui.resetSource.disabled = true;
      setRunEnabled(code.active !== null && !state.running);
      return;
    }

    ui.solutions.hidden = true;
    ui.resetSource.disabled = false;
    const onPrompt = code.file === 'prompt';
    ui.promptView.hidden = !onPrompt;
    ui.promptView.innerHTML = onPrompt ? code.prompt : '';
    ui.editor.hidden = onPrompt || code.active === null;
    ui.editor.readOnly = false;
    ui.editor.value = onPrompt ? '' : code.active ? code.edits[code.active] : '';
    ui.resetSource.hidden = onPrompt;
    updateDirty();
    refreshHighlight();
    setRunEnabled(!onPrompt && code.active !== null && !state.running);
  }

  function selectLanguage(language) {
    const code = state.code;
    if (code === null) return;
    // Keep the edits made to the language being left.
    if (code.active !== null && !ui.editor.hidden) code.edits[code.active] = ui.editor.value;
    chooseLanguage(language);
    applyLanguage(language);
    code.active = language;
    renderSourceTabs();
    showCode();
  }

  // Line endings are compared as LF, because a text area always stores LF. A starter read from a CRLF file would
  // otherwise look modified as soon as it is shown.
  function normalizeLineEndings(text) {
    return text.replace(/\r\n?/g, '\n');
  }

  // The file under edit differs from the step's starter. The prompt is never edited, so it is never modified.
  function isDirty() {
    const code = state.code;
    if (code === null || code.file === 'prompt' || code.active === null) return false;
    const text = ui.editor.hidden ? code.edits[code.active] : ui.editor.value;
    return normalizeLineEndings(text) !== normalizeLineEndings(code.starters[code.active] ?? '');
  }

  // Shows the "modified" indicator and enables Reset only while the file differs from its starter.
  function updateDirty() {
    const dirty = isDirty();
    ui.modified.hidden = !dirty;
    ui.resetSource.disabled = !dirty || (state.code !== null && state.code.solutionsOpen);
  }

  function setRunEnabled(enabled) {
    ui.run.disabled = !enabled;
    ui.check.disabled = !enabled;
  }

  // The solution gate. The first press asks the main process for the solutions, which also keeps the gate open for
  // later visits. After that, the button hides and shows the solutions.
  async function toggleSolutions() {
    const code = state.code;
    if (code === null) return;
    if (!code.solutionsOpen && code.solutions === null) {
      try {
        const result = await window.runner.revealSolutions(code.id);
        code.solutions = result.code ?? (result.markdown !== undefined ? { markdown: result.markdown } : null);
        code.prompt = result.prompt ?? null;
        code.solutionsRevealed = true;
      } catch (error) {
        showToast(error.message);
        return;
      }
    }
    if (!code.solutionsOpen) code.file = 'code';
    code.solutionsOpen = !code.solutionsOpen;
    renderFileSelect();
    renderSourceTabs();
    showCode();
    syncMarkdownPreview();
  }

  function setupSource() {
    ui.editor.addEventListener('input', () => {
      saveEditorText();
      refreshHighlight();
      updateDirty();
      if (state.code && state.code.markdown) scheduleMarkdownUpdate();
    });
    // Tab inserts spaces up to the next tab stop, every four columns, instead of moving focus out of the editor.
    // Shift+Tab removes up to four spaces from the start of the current line.
    ui.editor.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      const value = ui.editor.value;
      const start = ui.editor.selectionStart;
      const end = ui.editor.selectionEnd;
      const lineStart = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
      if (event.shiftKey) {
        const lead = value.slice(lineStart).match(/^ {1,4}/);
        if (!lead) return;
        ui.editor.setRangeText('', lineStart, lineStart + lead[0].length, 'preserve');
        ui.editor.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      const column = start - lineStart;
      const spaces = 4 - (column % 4);
      ui.editor.setRangeText(' '.repeat(spaces), start, end, 'end');
      ui.editor.dispatchEvent(new Event('input', { bubbles: true }));
    });
    ui.editor.addEventListener('scroll', syncHighlightScroll);
    ui.resetSource.addEventListener('click', () => {
      const code = state.code;
      if (code === null) return;
      const key = editKey();
      if (key === null || key === 'prompt') return;
      code.edits[key] = normalizeLineEndings(code.starters[key] ?? '');
      ui.editor.value = code.edits[key];
      refreshHighlight();
      if (code.markdown) scheduleMarkdownUpdate();
      updateDirty();
    });
    ui.fileSelect.addEventListener('change', () => selectFile(ui.fileSelect.value));
    ui.solutionsToggle.addEventListener('click', () => {
      toggleSolutions();
    });
    ui.run.addEventListener('click', () => {
      runCode();
    });
    ui.check.addEventListener('click', () => {
      checkCode();
    });
    ui.stopRun.addEventListener('click', () => {
      window.runner.stopRun();
    });
  }

  // ---- Running a step's code ----

  function setRunning(running) {
    state.running = running;
    ui.stopRun.disabled = !running;
    if (running) {
      ui.run.disabled = true;
      ui.check.disabled = true;
    } else if (state.code !== null) {
      setRunEnabled(state.code.active !== null && state.code.file !== 'prompt');
    }
  }

  async function runCode() {
    const code = state.code;
    if (code === null || code.active === null || code.file === 'prompt' || state.running || state.current === null) return;
    if (code.markdown) {
      renderRendered(code.solutionsOpen && code.solutions ? code.solutions.markdown : ui.editor.value);
      return;
    }
    // With the solutions open, Run runs the solution for the active language. Otherwise it runs the learner's code.
    const source = code.solutionsOpen
      ? (code.solutions ? (code.solutions[code.active] ?? '') : '')
      : ui.editor.value;
    ui.output.textContent = '';
    setRunning(true);
    try {
      await window.runner.runCode(state.current.id, code.active, source);
    } catch (error) {
      appendOutput(`${error.message}\n`, 'error');
      setRunning(false);
    }
  }

  // The Check button: a syntax check, then the output check if the syntax passes. Results are shown in the output pane.
  async function checkCode() {
    const code = state.code;
    if (code === null || code.active === null || code.file === 'prompt' || state.running || state.current === null) return;
    if (code.markdown) {
      await checkMarkdownStep();
      return;
    }
    const language = code.active;
    const source = code.solutionsOpen
      ? (code.solutions ? (code.solutions[language] ?? '') : '')
      : ui.editor.value;
    ui.output.textContent = '';
    setRunning(true);
    if (state.current.hasFileCheck) {
      appendOutput('Check empties the practice folder, then runs your script. Run keeps the files.\n', 'status');
    }
    try {
      reportCheck(language, await window.runner.checkCode(state.current.id, language, source));
      await showFileButtons();
    } catch (error) {
      appendOutput(`${error.message}\n`, 'error');
    } finally {
      setRunning(false);
    }
  }

  function reportCheck(language, result) {
    if (result.kind === 'diagnostics') {
      for (const item of result.items) {
        appendOutput(`main.${EXTENSIONS[language]}:${item.line}:${item.column} - error: ${item.message}\n`, 'error');
      }
      appendOutput(`\nCheck found ${result.items.length} problem${result.items.length === 1 ? '' : 's'}.\n`, 'status');
    } else if (result.kind === 'no-expected') {
      appendOutput('Check passed: no syntax errors. This step has no expected output to compare.\n', 'status');
    } else if (result.kind === 'passed') {
      appendOutput('Check passed: no errors, and the output matches the expected result.\n', 'status');
    } else if (result.kind === 'files') {
      appendOutput('The output matches, but the files left in the practice folder are not as expected:\n', 'error');
      for (const problem of result.problems) appendOutput(`  ${problem}\n`, 'error');
    } else {
      appendOutput('The output does not match the expected result.\n\nExpected:\n', 'error');
      appendOutput(`${result.expected}\n\nActual:\n`, 'error');
      appendOutput(`${result.actual}\n`, 'error');
    }
  }

  // After a run or check of a step that checks files, lists the text files in the practice folder with a button for
  // each, so the learner can open what their script made or changed in their own editor.
  async function showFileButtons() {
    if (!state.current || !state.current.hasFileCheck || !window.runner) return;
    let names = [];
    try {
      names = await window.runner.listPracticeFiles();
    } catch (error) {
      showToast(error.message);
      return;
    }
    if (names.length === 0) return;
    const row = document.createElement('div');
    row.className = 'file-buttons';
    for (const name of names) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'text-button';
      button.textContent = `Open ${name} in your editor`;
      button.addEventListener('click', async () => {
        try {
          await window.runner.openPracticeFile(name);
        } catch (error) {
          showToast(error.message);
        }
      });
      row.append(button);
    }
    ui.output.append(row);
    ui.output.scrollTop = ui.output.scrollHeight;
  }

  function handleRunEvent(event) {
    if (event.kind === 'stdout') {
      appendOutput(event.text);
    } else if (event.kind === 'stderr') {
      appendOutput(event.text, 'error');
    } else if (event.kind === 'done') {
      if (event.timedOut) {
        appendOutput('\nThe program was stopped because it ran for too long.\n', 'error');
      } else {
        appendOutput(`\nThe program finished with exit code ${event.code ?? 'unknown'}.\n`, 'status');
      }
      setRunning(false);
      showFileButtons();
    }
  }

  // ---- Navigation: the lesson list, and showing a lesson ----

  function renderNavigation() {
    ui.chapters.replaceChildren();
    for (const chapter of state.catalog) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'nav-row' + (chapter.id === state.chapterId ? ' selected' : '');
      row.textContent = chapter.label;
      row.addEventListener('click', () => openLesson(chapter.id));
      ui.chapters.append(row);
    }

    ui.lessons.replaceChildren();
    const chapter = state.catalog.find((candidate) => candidate.id === state.chapterId);
    if (!chapter) return;
    for (const step of chapter.steps) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'nav-row step' + (step.id === (state.current && state.current.id) ? ' selected' : '');
      row.textContent = step.title;
      row.addEventListener('click', () => openLesson(step.id));
      ui.lessons.append(row);
    }
  }

  function outputMessage(lesson) {
    if (lesson.kind === 'chapter') return 'This is a chapter introduction. There is no code to run.';
    if (lesson.languages.length > 0) return 'Press Run to run this step in the language you chose.';
    return 'This step has no code to run.';
  }

  async function openLesson(id) {
    let lesson;
    try {
      lesson = await window.runner.openLesson(id);
    } catch (error) {
      showToast(error.message);
      return;
    }

    displayLesson(lesson);
    if (isPopout) {
      // The pop-out reports its move, so the main window's lesson list and Next button follow it.
      window.runner.popoutNavigated(lesson.id);
      return;
    }
    try {
      await window.runner.visit(lesson.id);
    } catch (error) {
      showToast(`Progress could not be saved: ${error.message}`);
    }
    window.runner.syncPopout(lesson.id);
  }

  // Shows a lesson that has already been loaded. A normal move uses it, and so does a redraw after a progress reset.
  // The tab the learner is on stays put, so moving between steps doesn't switch them back to the Lesson tab.
  function displayLesson(lesson) {
    clearMarkdownPanes();
    if (state.current) scrollPositions.set(state.current.id, ui.lesson.scrollTop);
    state.current = lesson;
    state.chapterId = lesson.id.split('/')[0];
    state.previous = lesson.previous;
    state.next = lesson.next;

    ui.title.textContent = lesson.title;
    // The HTML comes from the course's own Markdown, rendered with raw HTML turned off.
    ui.lesson.innerHTML = lesson.html;
    indexLessonParts(ui.lesson);
    decorateCodeBlocks(ui.lesson);
    applyLanguage(currentLanguage());
    restoreProgress(lesson.progress || { quizzes: {}, spoilers: {} });
    ui.output.textContent = outputMessage(lesson);
    ui.next.disabled = lesson.next === null;
    ui.next.title = lesson.next ? `Next: ${lesson.next.title}` : 'This is the last lesson.';
    ui.nextHint.textContent = lesson.next ? lesson.next.title : '';
    ui.previous.disabled = lesson.previous === null;
    ui.previous.title = lesson.previous ? `Previous: ${lesson.previous.title}` : 'This is the first lesson.';
    ui.previousHint.textContent = lesson.previous ? lesson.previous.title : '';

    renderSource(lesson);
    showTab(activeTab());
    ui.lesson.scrollTop = scrollPositions.get(lesson.id) || 0;
    renderNavigation();
  }

  // Redraws the lesson on screen from the saved progress, which has just been cleared.
  async function redrawCurrent() {
    if (!state.current) return;
    try {
      displayLesson(await window.runner.openLesson(state.current.id));
    } catch (error) {
      showToast(error.message);
    }
  }

  // Puts a copy button on every code block in the given pane. It shows when the learner hovers over the block, and it
  // copies the block's text. Blocks that already have a button are left alone.
  function decorateCodeBlocks(root) {
    for (const pre of root.querySelectorAll('pre')) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) continue;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      pre.replaceWith(wrapper);
      wrapper.append(pre);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.title = 'Copy code';
      button.setAttribute('aria-label', 'Copy code');
      button.innerHTML = window.icon('copy', 14);
      button.addEventListener('click', (event) => copyText(pre.textContent, event.currentTarget));
      wrapper.append(button);
    }
  }

  // ---- Quizzes and spoilers ----

  // A quiz answer: the chosen answer shows its explanation beneath it, and a wrong answer is marked in red.
  // The listener is added once, to the lesson pane, so it keeps working for every lesson shown in it.
  function wireQuizzes(root) {
    root.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'radio') return;
      const quiz = input.closest('[data-quiz]');
      if (!quiz) return;

      const choices = Array.from(quiz.querySelectorAll('.quiz-choice'));
      for (const choice of choices) {
        choice.classList.remove('right', 'picked-wrong');
        choice.querySelector('.quiz-explain').hidden = true;
        if (choice.dataset.correct === 'true') choice.classList.add('right');
      }
      const picked = choices.find((choice) => choice.querySelector('input').checked);
      if (!picked) return;
      if (picked.dataset.correct !== 'true') picked.classList.add('picked-wrong');
      picked.querySelector('.quiz-explain').hidden = false;
      if (!restoring) saveProgress('quiz', Number(quiz.dataset.quizIndex), choices.indexOf(picked));
    });
  }

  // Each quiz and spoiler in a lesson is numbered from the top, so its saved state can be matched on the next run.
  function indexLessonParts(root) {
    root.querySelectorAll('[data-quiz]').forEach((quiz, index) => {
      quiz.dataset.quizIndex = String(index);
    });
    root.querySelectorAll('[data-spoiler]').forEach((spoiler, index) => {
      spoiler.dataset.spoilerIndex = String(index);
    });
  }

  // Puts back the quiz answers and spoiler states saved for this lesson. Restoring doesn't save again.
  function restoreProgress(progress) {
    restoring = true;
    try {
      for (const quiz of ui.lesson.querySelectorAll('[data-quiz]')) {
        const chosen = progress.quizzes[quiz.dataset.quizIndex];
        if (chosen === undefined) continue;
        const radio = quiz.querySelectorAll('input[type="radio"]')[chosen];
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      for (const spoiler of ui.lesson.querySelectorAll('[data-spoiler]')) {
        if (progress.spoilers[spoiler.dataset.spoilerIndex] === true) {
          setSpoilerOpen(spoiler, true);
        }
      }
    } finally {
      restoring = false;
    }
  }

  // Saves one answer or spoiler state for the lesson on screen. A failed save is shown as a message.
  function saveProgress(kind, index, value) {
    if (!state.current) return;
    window.runner.recordProgress(state.current.id, kind, index, value).catch((error) => {
      showToast(`Progress could not be saved: ${error.message}`);
    });
  }

  function setSpoilerOpen(spoiler, open) {
    const toggle = spoiler.querySelector('.spoiler-toggle');
    spoiler.querySelector('.spoiler-body').hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Hide example (spoiler)' : 'Show example (spoiler)';
  }

  // Clicks inside the lesson: spoilers, language tabs in examples, and links.
  ui.lesson.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const toggle = target ? target.closest('.spoiler-toggle') : null;
    if (toggle) {
      const spoiler = toggle.closest('[data-spoiler]');
      const opening = spoiler.querySelector('.spoiler-body').hidden;
      setSpoilerOpen(spoiler, opening);
      if (!restoring) saveProgress('spoiler', Number(spoiler.dataset.spoilerIndex), opening);
      return;
    }

    // A language tab shows that language's example in every examples block, and the choice is remembered.
    const language = target ? target.closest('.language-tab') : null;
    if (language) {
      chooseLanguage(language.dataset.language);
      applyLanguage(language.dataset.language);
      return;
    }

    // Links open in the learner's browser, not in the runner.
    const link = target ? target.closest('a[href]') : null;
    if (link) {
      event.preventDefault();
      window.runner.openExternal(link.getAttribute('href'));
    }
  });

  // ---- Next, Previous, the keyboard, and the buttons ----

  ui.next.addEventListener('click', () => {
    if (state.next) openLesson(state.next.id);
  });

  ui.previous.addEventListener('click', () => {
    if (state.previous) openLesson(state.previous.id);
  });

  // Ctrl+Left and Ctrl+Right move the cursor by word inside the editor, so they only change lesson elsewhere.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'F5') {
      // F5 runs the step, and Ctrl+F5 checks it. Both do what the buttons do, and the browser's reload is turned off.
      event.preventDefault();
      if (event.ctrlKey) checkCode();
      else runCode();
      return;
    }
    if (event.key === 'Escape' && state.running) {
      window.runner.stopRun();
      return;
    }
    if (!event.ctrlKey || event.altKey || event.shiftKey) return;
    if (event.target === ui.editor) return;
    if (event.key === 'ArrowRight' && state.next) {
      event.preventDefault();
      openLesson(state.next.id);
    } else if (event.key === 'ArrowLeft' && state.previous) {
      event.preventDefault();
      openLesson(state.previous.id);
    }
  });

  function setupButtons() {
    wireQuizzes(ui.lesson);
    // Ctrl+Alt+Shift+Backspace clears saved progress: quiz answers, spoiler states, the last lesson, visited steps,
    // and solution reveals.
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.altKey && event.shiftKey && event.key === 'Backspace') {
        event.preventDefault();
        window.runner.resetProgress();
      }
    });
    if (window.runner) {
      window.runner.onProgressReset(() => {
        redrawCurrent();
        showToast('Progress reset');
      });
      window.runner.onRunEvent((event) => handleRunEvent(event));
    }
    document.getElementById('copy-output').addEventListener('click', (event) => {
      copyText(ui.output.textContent, event.currentTarget);
    });
    document.getElementById('clear').addEventListener('click', () => {
      ui.output.textContent = '';
    });
    document.getElementById('copy-source').addEventListener('click', (event) => {
      if (activeTab() === 'lesson') {
        copyText(state.current ? state.current.markdown : '', event.currentTarget);
      } else {
        copyText(ui.promptView.hidden ? (ui.editor.hidden ? ui.solutionCode.textContent : ui.editor.value) : ui.promptView.textContent, event.currentTarget);
      }
    });
    document.getElementById('popout').addEventListener('click', () => {
      if (state.current) window.runner.popOutLesson(state.current.id);
    });
    document.getElementById('popout-copy').addEventListener('click', (event) => {
      copyText(state.current ? state.current.markdown : '', event.currentTarget);
    });
    document.getElementById('popout-dock').addEventListener('click', () => {
      window.runner.closePopout();
    });
    // Links in the rendered output open in the learner's browser, as they do in the lesson.
    ui.rendered.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link) return;
      event.preventDefault();
      window.runner.openExternal(link.getAttribute('href'));
    });
    document.getElementById('redock-button').addEventListener('click', () => {
      window.runner.closePopout();
    });
  }

  function setupPopoutState() {
    if (!window.runner) return;
    window.runner.onPopoutState((popoutState) => {
      state.popoutOpen = popoutState.open;
      refreshPaneVisibility();
    });
    // The pop-out moved to another lesson. Follow it, unless the main window already shows that lesson.
    window.runner.onPageNavigated((id) => {
      if (!state.current || state.current.id !== id) openLesson(id);
    });
  }

  // ---- Startup ----

  async function start() {
    setupGlyphs();
    setupTheme();
    setupZoom();
    setupTabs();
    setupSource();
    setupButtons();
    // The runner starts on the Lesson tab. After that, moving between steps keeps whichever tab the learner is on.
    showTab('lesson');

    if (!window.runner) {
      ui.title.textContent = 'The runner could not connect to its main process.';
      return;
    }

    if (isPopout) {
      document.body.classList.add('popout');
      // The pop-out shows the lesson given in the address, and follows the main window when it's asked to.
      window.runner.onShowLesson((id) => {
        // The main window's sync arrives for the lesson already shown after a pop-out move. Ignore it, so the two
        // windows don't loop.
        if (!state.current || state.current.id !== id) openLesson(id);
      });
      await openLesson(startLesson || (await firstLessonId()));
      return;
    }

    setupPopoutState();
    state.popoutOpen = (await window.runner.popoutState()).open;
    refreshPaneVisibility();

    try {
      state.catalog = await window.runner.listCatalog();
      if (state.catalog.length === 0) {
        ui.title.textContent = 'No chapters were found.';
        return;
      }
      const known = new Set(state.catalog.flatMap((chapter) => [chapter.id, ...chapter.steps.map((step) => step.id)]));
      const saved = await window.runner.getState();
      const startId = saved.lastStep && known.has(saved.lastStep) ? saved.lastStep : state.catalog[0].id;
      await openLesson(startId);
    } catch (error) {
      ui.title.textContent = 'The course could not be loaded.';
      showToast(error.message);
    }
  }

  async function firstLessonId() {
    const catalog = await window.runner.listCatalog();
    return catalog.length ? catalog[0].id : '';
  }

  // The pop-out has no chapter list, so its Next button needs the catalog too.
  if (isPopout && window.runner) {
    window.runner.listCatalog().then((catalog) => {
      state.catalog = catalog;
    });
  }

  start();
})();
