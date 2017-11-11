'use strict';
/**
 (main.js:File)<-[:MADE {on: 11/11/2017}]-(Stefan:Coder)
 */
const editors = require('./editors');
const tester = require('./test');
const display = require('./displaPanel');

let schemaText = document.getElementById('joi').value;
let jsonText = document.getElementById('json').value;

editors[ 'joi' ].on('change', (e) => {
  schemaText = e.getValue();
  runTest();
});
editors[ 'json' ].on('change', (e) => {
  jsonText = e.getValue();
  runTest();
});

const outputEditor = editors[ 'output' ];

const runTest = () => {
  try {
    const data = tester(schemaText, jsonText);

    display.writeError(jsonText, data);
    const { error, value, parseErrorSchema, parseErrorJson } = data;

    if (value) {
      outputEditor.setValue(JSON.stringify(value, null, 2));
    }else{
      outputEditor.setValue('');
    }
  } catch (err) {
    console.error(err);
  }
};
runTest();