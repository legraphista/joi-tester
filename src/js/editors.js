'use strict';
/**
 (editor:File)<-[:MADE {on: 11/11/2017}]-(Stefan:Coder)
 */

const CodeMirror = require('codemirror');
require('codemirror/addon/edit/closebrackets');
require('codemirror/mode/javascript/javascript');

require('codemirror/addon/lint/lint.js');
require('codemirror/addon/lint/javascript-lint.js');
require('codemirror/addon/lint/json-lint.js');

const factory = (textArea) => {
  const editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    autoCloseBrackets: true,
    tabSize: 2,
    mode: 'javascript',
    gutters: ["CodeMirror-lint-markers"],
    lint: true
  });
  editor.setOption("theme", 'cobalt');

  return editor;
};


const editors = window.editors = {};
['joi', 'json', 'output'].forEach(id => {

  const area = document.getElementById(id);

  editors[id] = factory(area);
});

module.exports = editors;