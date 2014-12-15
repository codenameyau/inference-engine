'use strict';

var InferenceEngine = require('../app/inference');
var chai = require('chai');
var assert = chai.assert;

/*******************************
 * Test Suite: InferenceEngine *
 *******************************/
describe('InferenceEngine', function() {

  // Reusable engine for testing
  var globalEngine = new InferenceEngine();
  var nounA = 'dogs';
  var nounB = 'cats';
  var inverseA = globalEngine.inverse(nounA);
  var inverseB = globalEngine.inverse(nounB);

  describe('.negate()', function() {
    it('should return false if the argument is true', function() {
      assert.isFalse(globalEngine.negate(true));
    });

    it('should return true if the argument is false', function() {
      assert.isTrue(globalEngine.negate(false));
    });
  });


  describe('.addNoun()', function() {
    var engine = new InferenceEngine();
    var graph = engine.getGraph();
    engine.addNoun(nounA);

    it('should add a new vertex to its graph for the noun', function() {
      assert.isTrue(graph.hasVertex(nounA));
      assert.strictEqual(graph.getSize(), 2);
    });

    it('should add a new vertex to its graph for not that noun', function() {
      assert.isTrue(graph.hasVertex(inverseA));
      assert.strictEqual(graph.getSize(), 2);
    });

    it('should create edge linking NOUN to itself with weight of 1', function() {
      assert.isTrue(graph.hasEdge(nounA, nounA));
      assert.strictEqual(graph.getWeight(nounA, nounA), 1);
    });

    it('should create edge linking NO-NOUN to itself with weight of 1', function() {
      assert.isTrue(graph.hasEdge(inverseA, inverseA));
      assert.strictEqual(graph.getWeight(inverseA, inverseA), 1);
    });

    it('should create edge linking NOUN to NO-NOUN with weight of 0', function() {
      assert.isTrue(graph.hasEdge(nounA, inverseA));
      assert.strictEqual(graph.getWeight(nounA, inverseA), 0);
    });

    it('should create edge linking NO-NOUN to NOUN with weight of 0', function() {
      assert.isTrue(graph.hasEdge(nounA, inverseA));
      assert.strictEqual(graph.getWeight(nounA, inverseA), 0);
    });

    it('should not replace any existing nouns with the same name', function() {
      var nounRefA = graph.getNeighbors(nounA);
      var nounRefB = graph.getNeighbors(inverseA);
      engine.addNoun(nounA);
      assert.deepEqual(graph.getNeighbors(nounA), nounRefA);
      assert.deepEqual(graph.getNeighbors(inverseA), nounRefB);
    });
  });


  describe('.hasNoun()', function() {
    var engine = new InferenceEngine();

    it('should not have noun because it is not yet added', function() {
      assert.isFalse(engine.hasNoun(nounA));
      assert.isFalse(engine.hasNoun(nounB));
    });

    it('should have nouns after adding them to the engine', function() {
      engine.addNoun(nounA);
      engine.addNoun(nounB);
      assert.isTrue(engine.hasNoun(nounA));
      assert.isTrue(engine.hasNoun(nounB));
    });
  });


  describe('.teachAllAre()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(nounA);
    engine.addNoun(nounB);

    it('should not yet have an edge from nounA to nounB', function() {
      assert.isFalse(engine.hasDirectRelationship(nounA, nounB));
      assert.isFalse(engine.hasDirectRelationship(nounB, nounA));
      assert.isFalse(engine.hasDirectRelationship(inverseA, inverseB));
      assert.isFalse(engine.hasDirectRelationship(inverseB, inverseA));
    });
  });


  describe('.hasDirectRelationship()', function() {
    var engine = new InferenceEngine();
    var graph = engine.getGraph();
    engine.addNoun(nounA);
    engine.addNoun(nounB);

    it('should be true since nouns have a direct relationship to themselves', function() {
      assert.isTrue(graph.hasDirectRelationship(nounA, nounA));
      assert.isTrue(graph.hasDirectRelationship(nounB, nounB));
    });

    it('should not have a direct relationship between nounA and nounB', function() {
      assert.isFalse(graph.hasDirectRelationship(nounA, nounB));
      assert.isFalse(graph.hasDirectRelationship(nounB, nounA));
    });
  });

});
