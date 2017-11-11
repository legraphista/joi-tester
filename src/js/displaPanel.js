'use strict';
/**
 (displaPanel:File)<-[:MADE {on: 11/11/2017}]-(Stefan:Coder)
 */
const editors = require('./editors');
const display = module.exports = {};

const statusDom = document.getElementsByClassName('status')[ 0 ];
const jsonEditorMarkers = [];
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
  console.clear();
  let find = code;
  let codeIndex = 0;

  path.forEach(p => {

    console.log(find);
    const reg = (new RegExp(`\{?("|')?${p}("|')?\s*?\:[\u0000-\uffff]*?(\\{|,|'|"|t|f|n|u|\\d)`, 'g')).exec(find);

    let index = reg.index - 1;
    codeIndex += index;

    find = find.substr(index);

    const start = index;
    let deep = 0;
    let lastMeaningfulIndex = index;

    while (deep >= 0 && index < code.length) {
       const c = code.charAt(index);

      if (deep === 0 && c === ',') {
        break;
      }

      if (c === '{' || c === '[') {
        deep++;
      }
      if (c === '}' || c === ']') {
        deep--;
      }

      index++;
      if (!~[ ' ', '\n', '\t', '{', '}', '[', ']' ].indexOf(c) && deep >= 0) {
        lastMeaningfulIndex = index;
      }
    }
    index --;
    if (!~[ ' ', '\n', '\t', '{', '}', '[', ']' ].indexOf(code.charAt(index)) && deep >= 0) {
      lastMeaningfulIndex = index;
    }

    find = find.substr(0, lastMeaningfulIndex - start);
  });

  codeIndex++;

  return {
    start: findLineCharFromIndex(code, codeIndex),
    end: findLineCharFromIndex(code, codeIndex + find.length - 1)
  };
};

display.writeError = (code, { error, value, parseErrorSchema, parseErrorJson }) => {

  statusDom.innerText = '';
  if (error || parseErrorJson || parseErrorSchema) {
    statusDom.innerText = (error || parseErrorJson || parseErrorSchema).toString();

    statusDom.classList.remove('valid');
    statusDom.classList.add('error');

    while (jsonEditorMarkers.length) {
      jsonEditorMarkers.pop().clear();
    }

    if (error) {

      error.details.forEach(({ path, type, message, context }) => {

        const { start, end } = walkCodeAndGetStartEnd(code, path);
        console.log('marking from', start, 'to, end', end);

        const textMarker = jsonEditor.markText(start, end, { className: 'error-code' });
        jsonEditorMarkers.push(textMarker);
      })

    }
  } else {
    statusDom.classList.add('valid');
    statusDom.classList.remove('error');
  }

};