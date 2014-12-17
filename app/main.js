/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */
'use strict';

var InferenceEngine = require('./inference');

(function() {

  var engine = new InferenceEngine();
  engine.addNoun('cats');
  engine.addNoun('dogs');
  engine.teachAllAre('cats', 'dogs');

})();
