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
    var noun = 'dogs';
    var inverseNoun = 'no dogs';
    engine.addNoun(noun);

    it('should add a new vertex to its graph for the noun', function() {
      assert.isTrue(graph.hasVertex(noun));
      assert.strictEqual(graph.getSize(), 2);
    });

    it('should add a new vertex to its graph for not that noun', function() {
      assert.isTrue(graph.hasVertex(inverseNoun));
      assert.strictEqual(graph.getSize(), 2);
    });

    it('should create edge linking NOUN to itself with weight of 1', function() {
      assert.isTrue(graph.hasEdge(noun, noun));
      assert.strictEqual(graph.getWeight(noun, noun), 1);
    });

    it('should create edge linking NO-NOUN to itself with weight of 1', function() {
      assert.isTrue(graph.hasEdge(inverseNoun, inverseNoun));
      assert.strictEqual(graph.getWeight(inverseNoun, inverseNoun), 1);
    });

    it('should create edge linking NOUN to NO-NOUN with weight of 0', function() {
      assert.isTrue(graph.hasEdge(noun, inverseNoun));
      assert.strictEqual(graph.getWeight(noun, inverseNoun), 0);
    });

    it('should create edge linking NO-NOUN to NOUN with weight of 0', function() {
      assert.isTrue(graph.hasEdge(noun, inverseNoun));
      assert.strictEqual(graph.getWeight(noun, inverseNoun), 0);
    });

    it('should not replace any existing nouns with the same name', function() {
      var nounRefA = graph.getNeighbors(noun);
      var nounRefB = graph.getNeighbors(inverseNoun);
      engine.addNoun(noun);
      assert.deepEqual(graph.getNeighbors(noun), nounRefA);
      assert.deepEqual(graph.getNeighbors(inverseNoun), nounRefB);
    });
  });

});
