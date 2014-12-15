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
InferenceEngine.prototype.getGraph = function() {
  return this.graph;
};

InferenceEngine.prototype.negate = function(definition) {
  return (definition === true) ? false : true;
};

InferenceEngine.prototype.inverse = function(noun) {
  // Use underscore to remove quotes from object key
  return 'no_' + noun;
};

InferenceEngine.prototype.addNoun = function(noun) {
  var inverseNoun = this.inverse(noun);
  this.graph.addVertex(noun);
  this.graph.addVertex(inverseNoun);
  this.graph.addEdge(noun, noun, 1);
  this.graph.addEdge(inverseNoun, inverseNoun, 1);
  this.graph.addEdge(noun, inverseNoun, 0);
  this.graph.addEdge(inverseNoun, noun, 0);
};


/************************************
 * InferenceEngine Teaching Methods *
 ************************************/
InferenceEngine.prototype.teachAllAre = function() {

};

InferenceEngine.prototype.teachNoAre = function() {

};

InferenceEngine.prototype.teachSomeAre = function() {

};

InferenceEngine.prototype.teachSomeAreNot = function() {

};


/*********************************
 * InferenceEngine Query Methods *
 *********************************/
InferenceEngine.prototype.queryAreAll = function() {

};

InferenceEngine.prototype.queryAreNo = function() {

};

InferenceEngine.prototype.queryAreSome = function() {

};

InferenceEngine.prototype.queryAreSomeNot = function() {

};

module.exports = InferenceEngine;
