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
  engine.addNoun('mammals');
  engine.addNoun('hairy animals');
  engine.addNoun('animals');
  engine.addNoun('cats');
  engine.addNoun('brown things');
  engine.teachAllAre('dogs', 'mammals');
  engine.teachAllAre('hairy animals', 'animals');
  engine.teachAllAre('mammals', 'hairy animals');
  engine.teachAllAre('cats', 'mammals');
  engine.teachSomeAre('animals', 'brown things');

  console.log(engine.queryAreAll('dogs', 'mammals'));
  console.log(engine.queryAreAll('dogs', 'cats'));
  console.log(engine.queryAreAll('dogs', 'animals'));
  console.log(engine.queryAreAll('cats', 'animals'));
  console.log(engine.queryAreAll('cats', 'dogs'));
  console.log(engine.queryAreSome('cats', 'brown things'));
  console.log(engine.queryAreSome('brown things', 'cats'));

})();
