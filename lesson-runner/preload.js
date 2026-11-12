// preload.js
//
// The only bridge between the lesson page and the main process. It exposes a fixed list of functions and nothing
// else. The page has no Node access, and these functions pass only plain data.

'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('runner', {
  listCatalog: () => ipcRenderer.invoke('catalog:list'),
  openLesson: (id) => ipcRenderer.invoke('lesson:open', id),
  getState: () => ipcRenderer.invoke('state:get'),
  visit: (id) => ipcRenderer.invoke('state:visit', id),
  recordProgress: (id, kind, index, value) => ipcRenderer.invoke('progress:record', id, kind, index, value),
  resetProgress: () => ipcRenderer.invoke('progress:reset'),
  onProgressReset: (callback) => {
    ipcRenderer.on('progress:reset', () => callback());
  },
  revealSolutions: (id) => ipcRenderer.invoke('solutions:reveal', id),
  toolchains: () => ipcRenderer.invoke('toolchains:get'),
  highlight: (code, language) => ipcRenderer.invoke('code:highlight', code, language),
  runCode: (id, language, code) => ipcRenderer.invoke('run:start', id, language, code),
  stopRun: () => ipcRenderer.invoke('run:stop'),
  checkCode: (id, language, code) => ipcRenderer.invoke('check:run', id, language, code),
  markdownRender: (source) => ipcRenderer.invoke('markdown:render', source),
  markdownCheck: (id, source) => ipcRenderer.invoke('markdown:check', id, source),
  listPracticeFiles: () => ipcRenderer.invoke('practice:list'),
  openPracticeFile: (name) => ipcRenderer.invoke('practice:open', name),
  onRunEvent: (callback) => {
    ipcRenderer.on('run:event', (_event, payload) => callback(payload));
  },
  openExternal: (url) => ipcRenderer.invoke('link:open', url),
  popOutLesson: (id) => ipcRenderer.invoke('popout:open', id),
  popoutNavigated: (id) => ipcRenderer.invoke('popout:navigated', id),
  syncPopout: (id) => ipcRenderer.invoke('popout:sync', id),
  closePopout: () => ipcRenderer.invoke('popout:close'),
  popoutState: () => ipcRenderer.invoke('popout:state'),
  onPopoutState: (callback) => {
    ipcRenderer.on('popout:state', (_event, state) => callback(state));
  },
  onShowLesson: (callback) => {
    ipcRenderer.on('page:show', (_event, id) => callback(id));
  },
  onPageNavigated: (callback) => {
    ipcRenderer.on('page:navigated', (_event, id) => callback(id));
  },
});
