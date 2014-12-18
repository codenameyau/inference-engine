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

  // Define tab-completion
  var tabCompletion = function(line) {
    var completions = 'All No are'.split(' ');
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
    switch (line.trim()) {
      case 'help':
        console.log('HELP');
        break;
      default:
        console.log('Hi ' + line);
        break;
    }
    console.log();
    rl.prompt();

  }).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
  });

})();
