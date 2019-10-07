'use strict';
/**
 (test:File)<-[:MADE {on: 11/11/2017}]-(Stefan:Coder)
 */
const Joi = require('@hapi/joi');
const joi = Joi;

module.exports = (schemaText, jsonText) => {

  let schema, parseErrorSchema;
  try {
    schema = eval(schemaText);
  } catch (err) {
    parseErrorSchema = err;
  }

  let json, parseErrorJson;
  try {
    if (jsonText.trim()) {
      json = eval(`(${jsonText})`);
    }
  } catch (err) {
    parseErrorJson = err;
  }

  if (parseErrorSchema || parseErrorJson) {
    return { parseErrorSchema, parseErrorJson };
  }

  // todo add options
  const { error, value } = schema.validate(json);

  return { error, value };
};