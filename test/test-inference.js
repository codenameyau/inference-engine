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
  noun[4] = 'brown things';

  // Get inverse of nouns
  var inverse = [];
  for (var i=0, l=noun.length; i<l; i++) {
    noun[i] = globalEngine.replaceSpaces(noun[i]);
    inverse.push(globalEngine.inverse(noun[i]));
  }


  describe('.negate()', function() {
    it('should return false if the argument is true', function() {
      assert.strictEqual(globalEngine.negate(1), 0);
    });

    it('should return true if the argument is false', function() {
      assert.strictEqual(globalEngine.negate(0), 1);
    });
  });


  describe('.replaceSpaces()', function() {
    it('should replace spaces from nouns', function() {
      assert.strictEqual('hairy_animals', globalEngine.replaceSpaces('hairy animals'));
    });

    it ('should replace consecutive spaces with a single underscore', function() {
      assert.strictEqual('hairy_animals', globalEngine.replaceSpaces('hairy  animals'));
    });

    it ('should replace all spaces and dashes with underscores', function() {
      assert.strictEqual('four_legged_hairy_animals', globalEngine.replaceSpaces('four-legged hairy animals'));
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


  describe('.assertStatement()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(noun[0]);
    engine.addNoun(noun[1]);

    it('should return true assertion statements for noun', function() {
      assert.isTrue(engine.assertStatement(noun[0], noun[0], 1));
      assert.isTrue(engine.assertStatement(inverse[0], inverse[0], 1));
      assert.isTrue(engine.assertStatement(noun[0], inverse[0], 0));
      assert.isTrue(engine.assertStatement(inverse[0], noun[0], 0));
    });
  });


  describe('.teachAllAre()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(noun[0]);
    engine.addNoun(noun[1]);
    engine.addNoun(noun[2]);

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

    it('should have the correct weights assigned between noun relationships', function() {
      assert.strictEqual(engine.getRelationship(noun[0], noun[1]), 1);
      assert.strictEqual(engine.getRelationship(inverse[1], inverse[0]), 1);
      assert.strictEqual(engine.getRelationship(inverse[1], noun[0]), 0);
      assert.strictEqual(engine.getRelationship(inverse[0], noun[1]), 0);
      assert.strictEqual(engine.getRelationship(noun[1], inverse[0]), 0);
      assert.strictEqual(engine.getRelationship(noun[0], inverse[1]), 0);
    });

    it('should add additional relationships with other nouns', function() {
      engine.teachAllAre(noun[0], noun[2]);
      assert.isTrue(engine.hasDirectRelationship(noun[0], noun[2]));
      assert.strictEqual(engine.getRelationship(noun[0], noun[2]), 1);
    });
  });


  describe('.teachNoAre()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(noun[0]);
    engine.addNoun(noun[3]);

    it('should have a direct relationship from noun[0] to noun[3]', function() {
      engine.teachNoAre(noun[0], noun[3]);
      assert.isTrue(engine.hasDirectRelationship(noun[0], noun[3]));
    });

    it('should have the correct weights between relationship', function() {
      assert.strictEqual(engine.getRelationship(noun[0], noun[3]), 0);
      assert.strictEqual(engine.getRelationship(inverse[3], inverse[0]), 0);
      assert.strictEqual(engine.getRelationship(inverse[3], noun[0]), 0);
      assert.strictEqual(engine.getRelationship(inverse[0], noun[3]), 0);
      assert.strictEqual(engine.getRelationship(noun[3], inverse[0]), 1);
      assert.strictEqual(engine.getRelationship(noun[0], inverse[3]), 1);
    });
  });


  describe('.queryEngine()', function() {
    var engine = new InferenceEngine();
    engine.addNoun(noun[0]); // 'dogs'
    engine.addNoun(noun[1]); // 'mammals'
    engine.addNoun(noun[2]); // 'hairy animals'
    engine.addNoun(noun[3]); // 'cats'
    engine.addNoun(noun[4]); // 'brown things'

    // Teach engine and build relationships
    engine.teachAllAre(noun[0], noun[1]);
    engine.teachAllAre(noun[1], noun[2]);
    engine.teachNoAre(noun[0], noun[3]);

    it('should return true for the relationship between a noun and itself', function() {
      for (var i=0, l=noun.length; i<l; i++) {
        assert.isTrue(engine.queryEngine(noun[i], noun[i], 1));
        assert.isTrue(engine.queryEngine(inverse[i], inverse[i], 1));
      }
    });

    it('should return true for the relationship from noun[0] through noun[1]', function() {
      assert.isTrue(engine.queryEngine(noun[0], noun[1], 1, true));
      assert.isTrue(engine.queryEngine(noun[1], noun[2], 1, true));
      assert.isTrue(engine.queryEngine(noun[0], noun[2], 1, true));
    });

    it('should return false for the following relationships', function() {
      assert.isFalse(engine.queryEngine(noun[0], noun[3], 1, true));
      assert.isFalse(engine.queryEngine(noun[3], noun[0], 1, true));
      assert.isFalse(engine.queryEngine(noun[0], noun[4], 1, true));
    });
  });


  describe('Scenario 1', function() {
    var engine = new InferenceEngine();
    engine.addNoun('dogs');
    engine.addNoun('cats');
    engine.addNoun('mammals');
    engine.addNoun('animals');
    engine.addNoun('octopuses');

    // Teach the engine
    engine.teachAllAre('dogs', 'mammals');
    engine.teachAllAre('cats', 'mammals');
    engine.teachAllAre('mammals', 'animals');
    engine.teachAllAre('octopuses', 'animals');
    engine.teachNoAre('cats', 'dogs');
    engine.teachNoAre('octopuses', 'mammals');

    it('should return true for the following provable ALL queries', function() {
      assert.isTrue(engine.queryAreAll('dogs', 'mammals'));
      assert.isTrue(engine.queryAreAll('dogs', 'animals'));
      assert.isTrue(engine.queryAreAll('cats', 'mammals'));
      assert.isTrue(engine.queryAreAll('cats', 'animals'));
    });

    it('should return false for the following provable ALL queries', function() {
      assert.isFalse(engine.queryAreAll('dogs', 'cats'));
      assert.isFalse(engine.queryAreAll('mammals', 'cats'));
      assert.isFalse(engine.queryAreAll('mammals', 'dogs'));
      assert.isFalse(engine.queryAreAll('animals', 'dogs'));
      assert.isFalse(engine.queryAreAll('animals', 'mammals'));
      assert.isFalse(engine.queryAreAll('octopuses', 'mammals'));
    });

    it('should return true for the following provable NO queries', function() {
      assert.isTrue(engine.queryAreNo('dogs', 'cats'));
      assert.isTrue(engine.queryAreNo('cats', 'dogs'));
      assert.isTrue(engine.queryAreNo('octopuses', 'dogs'));
      assert.isTrue(engine.queryAreNo('octopuses', 'mammals'));
      assert.isTrue(engine.queryAreNo('dogs', 'octopuses'));
    });

    it('should return false for the following provable NO queries', function() {
      assert.isFalse(engine.queryAreNo('dogs', 'mammals'));
      assert.isFalse(engine.queryAreNo('mammals', 'dogs'));
      assert.isFalse(engine.queryAreNo('dogs', 'animals'));
      assert.isFalse(engine.queryAreNo('animals', 'dogs'));
      assert.isFalse(engine.queryAreNo('animals', 'octopuses'));
    });
  });

});
