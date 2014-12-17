/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */
'use strict';

var InferenceEngine = require('./inference');

(function() {

  var engine = new InferenceEngine();
  engine.addNoun('dogs');
  engine.addNoun('cats');
  engine.addNoun('mammals');
  engine.addNoun('octopuses');
  engine.teachAllAre('dogs', 'mammals');
  engine.teachNoAre('dogs', 'cats');
  engine.teachNoAre('octopuses', 'mammals');

  // console.log(engine.graph);
  // console.log(engine.queryAreNo('octopuses', 'dogs'));
  // console.log(engine.queryAreSome('dogs', 'cats'));
  console.log(engine.queryAreNo('dogs', 'mammals'));

})();
