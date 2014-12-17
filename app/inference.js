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
 * relationships between two properties.
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
  return (definition === 1) ? 0 : 1;
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

InferenceEngine.prototype.assertStatement = function(nounA, nounB, value) {
  return this.getRelationship(nounA, nounB) === value;
};


/************************************
 * InferenceEngine Teaching Methods *
 ************************************/
InferenceEngine.prototype.teachEngine = function(nounA, nounB, truth) {
  // [TODO]: check for contradictions
  nounA = this.replaceSpaces(nounA);
  nounB = this.replaceSpaces(nounB);
  var inverseA = this.inverse(nounA);
  var inverseB = this.inverse(nounB);
  this.graph.addEdge(nounA, nounB, truth[0]);
  this.graph.addEdge(inverseB, inverseA, truth[1]);
  this.graph.addEdge(inverseA, nounB, truth[2]);
  this.graph.addEdge(inverseB, nounA, truth[3]);
  this.graph.addEdge(nounA, inverseB, truth[4]);
  this.graph.addEdge(nounB, inverseA, truth[5]);
};

InferenceEngine.prototype.teachAllAre = function(nounA, nounB) {
  this.teachEngine(nounA, nounB, [1, 1, 0, 0, 0, 0]);
};

InferenceEngine.prototype.teachNoAre = function(nounA, nounB) {
  this.teachEngine(nounA, nounB, [0, 0, 0, 0, 1, 1]);
};

InferenceEngine.prototype.teachSomeAre = function(nounA, nounB) {
  this.teachEngine(nounA, nounB, [0, 0, 0, 0, 0, 0]);
};


/*********************************
 * InferenceEngine Query Methods *
 *********************************/
InferenceEngine.prototype.queryEngine = function(nounA, nounB, truth, provable) {
  // Replace spaces and lower
  nounA = this.replaceSpaces(nounA);
  nounB = this.replaceSpaces(nounB);

  // Perform BFS
  var queue = [nounA];
  var visited = {nounA: 1};
  while (queue.length > 0) {
    var current = queue.shift();

    // Target is found
    if (current === nounB) { return true; }

    // Search through neighbors
    for (var node in this.graph.getNeighbors(current)) {
      var deducedRelationship = !visited.hasOwnProperty(node);

      // Provable (always true)
      if (provable) {
        deducedRelationship = deducedRelationship &&
        (this.graph.getWeight(current, node) === truth);
      }

      // Search neighbor if relationship is deduced
      if (deducedRelationship) {
        visited[node] = 1;
        queue.push(node);
      }
    }
  }
  return false;
};

InferenceEngine.prototype.queryAreAll = function(nounA, nounB) {
  return this.queryEngine(nounA, nounB, 1, true);
};

InferenceEngine.prototype.queryAreNo = function(nounA, nounB) {
  return this.queryEngine(nounA, nounB, 0, true);
};

InferenceEngine.prototype.queryAreSome = function(nounA, nounB) {
  return this.queryEngine(nounA, nounB, 0, false);
};


/************************************
 * InferenceEngine Internal Methods *
 ************************************/
InferenceEngine.prototype.replaceSpaces = function(noun) {
  return noun.replace(/[\-\s]+/g, '_').toLowerCase();
};

module.exports = InferenceEngine;
