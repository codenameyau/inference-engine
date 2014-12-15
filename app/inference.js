/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */
'use strict';

var Graph = require('directed-graph');


/*******************************
 * InferenceEngine Constructor *
 *******************************/
function InferenceEngine() {
  this.graph = new Graph();
}

/**********************************
 * InferenceEngine Public Methods *
 **********************************/
InferenceEngine.prototype.negate = function(definition) {
  return (definition === true) ? false : true;
};


module.exports = InferenceEngine;
