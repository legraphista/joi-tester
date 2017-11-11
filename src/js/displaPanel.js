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
  let find = code;
  let index = 0;

  path.forEach(p => {

    const exp = (new RegExp(`\{?("|')?${p}("|')?\s*?\:\s*?((.*?)(,|\\}|\\n|$))`, 'g')).exec(find);
    // console.log(exp);
    index += exp.index;
    find = exp[ 0 ];
    // console.log(find);
  });

  return {
    start: findLineCharFromIndex(code, index),
    end: findLineCharFromIndex(code, index + find.length)
  };
};

display.writeError = (code, { error, value, parseErrorSchema, parseErrorJson }) => {

  statusDom.innerText = '';
  if (error || parseErrorJson || parseErrorSchema) {
    statusDom.innerText = (error || parseErrorJson || parseErrorSchema).toString();

    statusDom.classList.remove('valid');
    statusDom.classList.add('error');

    while(jsonEditorMarkers.length){
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