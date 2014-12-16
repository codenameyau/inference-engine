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

  // Define nouns
  var noun = [];
  noun[0] = 'dogs';
  noun[1] = 'mammals';
  noun[2] = 'hairy animals';
  noun[3] = 'cats';

  // Get inverse of nouns
  var inverse = [];
  for (var i=0, l=noun.length; i<l; i++) {
    inverse.push(globalEngine.inverse(noun[i]));
  }


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
    engine.addNoun(noun[0]);

    it('should add a new vertex to its graph for the noun', function() {
      assert.isTrue(graph.hasVertex(noun[0]));
      assert.strictEqual(graph.getSize(), 2);
    });

    it('should add a new vertex to its graph for not that noun', function() {
      assert.isTrue(graph.hasVertex(inverse[0]));
      assert.strictEqual(graph.getSize(), 2);
    });

    it('should create edge linking NOUN to itself with weight of 1', function() {
      assert.isTrue(graph.hasEdge(noun[0], noun[0]));
      assert.strictEqual(graph.getWeight(noun[0], noun[0]), 1);
    });

    it('should create edge linking NO-NOUN to itself with weight of 1', function() {
      assert.isTrue(graph.hasEdge(inverse[0], inverse[0]));
      assert.strictEqual(graph.getWeight(inverse[0], inverse[0]), 1);
    });

    it('should create edge linking NOUN to NO-NOUN with weight of 0', function() {
      assert.isTrue(graph.hasEdge(noun[0], inverse[0]));
      assert.strictEqual(graph.getWeight(noun[0], inverse[0]), 0);
    });

    it('should create edge linking NO-NOUN to NOUN with weight of 0', function() {
      assert.isTrue(graph.hasEdge(noun[0], inverse[0]));
      assert.strictEqual(graph.getWeight(noun[0], inverse[0]), 0);
    });

    it('should not replace any existing nouns with the same name', function() {
      var nounRefA = graph.getNeighbors(noun[0]);
      var nounRefB = graph.getNeighbors(inverse[0]);
      engine.addNoun(noun[0]);
      assert.deepEqual(graph.getNeighbors(noun[0]), nounRefA);
      assert.deepEqual(graph.getNeighbors(inverse[0]), nounRefB);
    });
  });


  describe('.hasNoun()', function() {
    var engine = new InferenceEngine();

    it('should not have noun because it is not yet added', function() {
      assert.isFalse(engine.hasNoun(noun[0]));
      assert.isFalse(engine.hasNoun(noun[1]));
    });

    it('should have nouns after adding them to the engine', function() {
      engine.addNoun(noun[0]);
      engine.addNoun(noun[1]);
      assert.isTrue(engine.hasNoun(noun[0]));
      assert.isTrue(engine.hasNoun(noun[1]));
    });
  });


  describe('.teachAllAre()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(noun[0]);
    engine.addNoun(noun[1]);

    it('should not yet have an edge from noun[0] to noun[1]', function() {
      assert.isFalse(engine.hasDirectRelationship(noun[0], noun[1]));
      assert.isFalse(engine.hasDirectRelationship(noun[1], noun[0]));
      assert.isFalse(engine.hasDirectRelationship(inverse[0], inverse[1]));
      assert.isFalse(engine.hasDirectRelationship(inverse[1], inverse[0]));
    });

    it('should now have a direct relationship from noun[0] to noun[1]', function() {
      engine.teachAllAre(noun[0], noun[1]);
      assert.isTrue(engine.hasDirectRelationship(noun[0], noun[1]));
    });

  });


  describe('.hasDirectRelationship()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(noun[0]);
    engine.addNoun(noun[1]);

    it('should be true since nouns have a direct relationship to themselves', function() {
      assert.isTrue(engine.hasDirectRelationship(noun[0], noun[0]));
      assert.isTrue(engine.hasDirectRelationship(noun[1], noun[1]));
      assert.isTrue(engine.hasDirectRelationship(inverse[0], inverse[0]));
      assert.isTrue(engine.hasDirectRelationship(inverse[1], inverse[1]));
    });

    it('should not have a direct relationship between noun[0] and noun[1]', function() {
      assert.isFalse(engine.hasDirectRelationship(noun[0], noun[1]));
      assert.isFalse(engine.hasDirectRelationship(noun[1], noun[0]));
    });
  });

});
