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

});
