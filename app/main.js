/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */
'use strict';

var readline = require('readline');
var InferenceEngine = require('./inference');

(function() {

  /**************************
   * Interface Help Message *
   **************************/
  var displayHelpMessage = function() {
    console.log('\nYou can teach the engine with the following commands:\n');
    console.log('  all NOUN are NOUN');
    console.log('  no NOUN are NOUN');
    console.log('\nYou can ask the engine the following questions:\n');
    console.log('  are all NOUN NOUN?');
    console.log('  are no NOUN NOUN?');
    console.log('\n\nExample:\n');
    console.log('   > all dogs are mammals');
    console.log('   > all mammals are animals');
    console.log('   > are all dogs animals?');
  };


  /******************************
   * Interface Tab Completetion *
   ******************************/
  var tabCompletion = function(line) {
    var completions = 'all no are'.split(' ');
    var hits = completions.filter(function(c) {
      return c.indexOf(line) === 0; });
    return [hits.length ? hits : completions, line];
  };


  /**************************
   * Command-line Interface *
   **************************/
  var engine = new InferenceEngine();
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: tabCompletion,
  });

  // Create the interactive interface
  rl.write('Welcome to the inference engine demo! \nType "help" for help.\n\n');
  rl.setPrompt('> ');
  rl.prompt();

  // Define regex matches
  var matchAllAre = /^all\s+([a-z\s])+\s+are\s+([a-z\s])+\.?$/g;
  var matchNoAre = /^no\s+([a-z\s])+\s+are\s+([a-z\s])+\.?$/g;

  // Define prompt cases
  rl.on('line', function(line) {
    line = line.trim().toLowerCase();

    switch (true) {

      case matchAllAre.test(line):
        console.log('TEACH ALL');
        break;

      case matchNoAre.test(line):
        console.log('TEACH NO');
        break;

      default:
        console.log('I do not understand. Type "help" for help.');
        break;
    }

    console.log();
    rl.prompt();

  }).on('close', function() {
    console.log('\nHave a great day!');
    process.exit(0);
  });

})();
