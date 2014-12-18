/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */
'use strict';

var readline = require('readline');
var InferenceEngine = require('./inference');

(function() {

  // Create inference engine
  var engine = new InferenceEngine();

  // Define help console message
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

  // Define tab-completion
  var tabCompletion = function(line) {
    var completions = 'all no are'.split(' ');
    var hits = completions.filter(function(c) {
      return c.indexOf(line) === 0; });
    return [hits.length ? hits : completions, line];
  };

  // Create command-line interface
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: tabCompletion,
  });

  // Create the interactive interface
  rl.write('Welcome to the inference engine demo! \nType "help" for help.\n\n');
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', function(line) {
    console.log(line.match(/^all\s+([a-z\s])+\s+are\s+([a-z\s])+\.?$/g));
    switch (line.trim().toLowerCase()) {

      // Help message
      case 'help':
        displayHelpMessage();
        break;

      // Teach: All NOUN are NOUN
      case line.match(/^all\s+([a-z\s])+\s+are\s+([a-z\s])+\.?$/g)[0]:
        // [TODO]
        console.log('TEACH ALL');
        break;

      // Teach: No NOUN are NOUN
      case line.match(/^no\s+([a-z\s])+\s+are\s+([a-z\s])+\.?$/g)[0]:
        // [TODO]
        console.log('TEACH NO');
        break;

      default:
        console.log('Hi ' + line);
        break;
    }
    console.log();
    rl.prompt();

  }).on('close', function() {
    console.log('\nHave a great day!');
    process.exit(0);
  });

})();
