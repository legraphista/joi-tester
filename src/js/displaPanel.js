'use strict';
/**
 (displaPanel:File)<-[:MADE {on: 11/11/2017}]-(Stefan:Coder)
 */
const editors = require('./editors');
const display = module.exports = {};

const statusDom = document.getElementsByClassName('status')[ 0 ];
const jsonEditorMarkers = [];
const jsonEditorDomWidgets = [];
const { json: jsonEditor } = editors;

const findLineCharFromIndex = (string, index) => {
  let line = 0;
  let ch = 0;
  for (let i = 0; i < index; i++) {
    const c = string.charAt(i);
    if (c === '\n') {
      line++;
      ch = 0;
    } else {
      ch++;
    }
  }

  return { line, ch };
};
const walkCodeAndGetStartEnd = (code, path) => {
  let find = code;
  let codeIndex = 0;

  path.forEach((p, pathIndex) => {

    const reg = (new RegExp(`\{?("|')?${p}("|')?\\s*?\:[\\u0000-\\uffff]*?(\\{|\\[|'|"|t|f|n|u|\\d)`, 'g')).exec(find);
    let index = Math.max(0, reg.index - 1) + codeIndex;

    find = code.substr(index);
    let blockStart = find.indexOf(reg[ 3 ]);
    const start = index;
    index += Math.max(0, blockStart - 1);

    let deep = 0;
    let lastMeaningfulIndex = index;

    while (deep >= 0 && index < code.length) {
      const c = code.charAt(index);
      index++;

      if (deep === 0 && c === ',') {
        break;
      }

      if (c === '{' || c === '[') {
        deep++;
      }
      if (c === '}' || c === ']') {
        deep--;
      }

      if (!~[ ' ', '\n', '\t' ].indexOf(c) && deep >= 0) {
        lastMeaningfulIndex = index;
      }
    }
    index--;
    if (!~[ ' ', '\n', '\t' ].indexOf(code.charAt(index)) && deep >= 0) {
      lastMeaningfulIndex = index;
    }

    // if it's the last path, take the full code
    if (pathIndex === path.length - 1) {
      blockStart = 1;
    }
    find = find.substr(blockStart, lastMeaningfulIndex - start - blockStart + 1);
    codeIndex = start + blockStart - 1;
  });

  codeIndex++;

  return {
    start: findLineCharFromIndex(code, codeIndex),
    end: findLineCharFromIndex(code, codeIndex + find.length - 1)
  };
};

display.writeError = (code, { error, value, parseErrorSchema, parseErrorJson }) => {

  while (jsonEditorMarkers.length) {
    jsonEditorMarkers.pop().clear();
  }
  while (jsonEditorDomWidgets.length) {
    const w = jsonEditorDomWidgets.pop();
    w.parentElement && w.parentElement.removeChild(w);
  }

  statusDom.innerText = '';
  if (error || parseErrorJson || parseErrorSchema) {
    statusDom.innerText = (error || parseErrorJson || parseErrorSchema).toString();

    statusDom.classList.remove('valid');
    statusDom.classList.add('error');

    if (error) {

      error.details.forEach(({ path, type, message, context }) => {

        const { start, end } = walkCodeAndGetStartEnd(code, path);

        const textMarker = jsonEditor.markText(start, end, {
          className: 'error-code',
          inclusiveRight: true,
          inclusiveLeft: true
        });
        jsonEditorMarkers.push(textMarker);

        const domWidget = document.createElement('div');
        domWidget.classList.add('code-widget');
        jsonEditorDomWidgets.push(domWidget);

        domWidget.innerHTML = `\
<span>Type</span>: ${type}
<span>Path</span>: ${path.join('.')}
<span>Message</span>: ${message}
<span>Context</span>: ${JSON.stringify(context, null, 2)}\
`;
        jsonEditor.addWidget(start, domWidget);
      })

    }
  } else {
    statusDom.classList.add('valid');
    statusDom.classList.remove('error');
  }

};