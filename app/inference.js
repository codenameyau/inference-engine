/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 *
 * Description:
 * InferenceEngine is capable of learning facts and making
 * logical deductions based on facts that it already knows.
 *
 * Implementation:
 * InferenceEngine is implemented as a weighted directed graph,
 * where the vertices represent properties and the edges represent
 * relationships between two properties. Each property has an
 * relationship with its inverse property with a weight of -1.
 *
 * The weights indicate whether a relationship is always true (weight = 1),
 * sometimes true (weight = 0), or never true (weight = -1).
 * Weights function more as labels rather than costs.
 */
'use strict';

var Graph = require('directed-graph');


/*******************************
 * InferenceEngine Constructor *
 *******************************/
function InferenceEngine() {
  this.graph = new Graph();
  this.truth = {
    always: 1,
    sometimes: 0,
    never: -1
  };
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
  return this.replaceSpaces('no ' + noun);
};

InferenceEngine.prototype.addNoun = function(noun) {
  noun = this.replaceSpaces(noun);
  var inverseNoun = this.inverse(noun);
  this.graph.addVertex(noun);
  this.graph.addVertex(inverseNoun);
  this.graph.addEdge(noun, noun, 1);
  this.graph.addEdge(inverseNoun, inverseNoun, 1);
  this.graph.addEdge(noun, inverseNoun, 0);
  this.graph.addEdge(inverseNoun, noun, 0);
};

InferenceEngine.prototype.hasNoun = function(noun) {
  return (this.graph.hasVertex(noun) && this.graph.hasVertex(this.inverse(noun)));
};

InferenceEngine.prototype.hasDirectRelationship = function(nounA, nounB) {
  return this.graph.hasEdge(nounA, nounB);
};

InferenceEngine.prototype.getRelationship = function(nounA, nounB) {
  return this.graph.getWeight(nounA, nounB);
};


/************************************
 * InferenceEngine Teaching Methods *
 ************************************/
InferenceEngine.prototype.teachAllAre = function(nounA, nounB) {
  // [TODO]: check for contradictions
  var inverseA = this.inverse(nounA);
  var inverseB = this.inverse(nounB);
  this.graph.addEdge(nounA, nounB, 1);
  this.graph.addEdge(inverseB, inverseA, 1);
  this.graph.addEdge(inverseA, nounB, 0);
  this.graph.addEdge(inverseB, nounA, 0);
  this.graph.addEdge(nounA, inverseB, 0);
  this.graph.addEdge(nounB, inverseA, 0);
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


/************************************
 * InferenceEngine Internal Methods *
 ************************************/
InferenceEngine.prototype.replaceSpaces = function(noun) {
  return noun.replace(/[\-\s]+/g, '_');
};

module.exports = InferenceEngine;
