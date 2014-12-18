/*!
 * InferenceEngine - inference.js
 * MIT License (c) 2014
 * codenameyau.github.io
 *
 * Tasks:
 * - check for contradictions when teaching
 * - update tab completion after teaching
 * - teach "some NOUNs are NOUNs"
 * - query "are some NOUNs NOUNs?"
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
    console.log('\n\nQuit with "ctr + c"\n');
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


  /***************************
   * Interface Regex Matches *
   ***************************/
  var matchHelp = /^help$/i;
  var matchAllAre = /^all ([a-z\s]+) are ([a-z\s]+)\.?$/i;
  var matchNoAre = /^no ([a-z\s]+) are ([a-z\s]+)\.?$/i;
  var matchAreAll = /^are all ([a-z\s]+) ([a-z\s]+)\??$/i;
  var matchAreNo = /^are no ([a-z\s]+) ([a-z\s]+)\??$/i;
  var extractNouns = function(string, regex) {
      return regex.exec(string);
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

  // Define prompt cases
  rl.on('line', function(line) {
    line = line.trim().toLowerCase();
    var nouns, result;

    switch (true) {

      case matchHelp.test(line):
        displayHelpMessage();
        break;

      case matchAllAre.test(line):
        nouns = extractNouns(line, matchAllAre);
        engine.teachAllAre(nouns[1], nouns[2]);
        console.log('Okay.');
        break;

      case matchNoAre.test(line):
        nouns = extractNouns(line, matchNoAre);
        engine.teachNoAre(nouns[1], nouns[2]);
        console.log('Okay.');
        break;

      case matchAreAll.test(line):
        nouns = extractNouns(line, matchAreAll);
        result = engine.queryAreAll(nouns[1], nouns[2]);
        console.log(result);
        break;

      case matchAreNo.test(line):
        nouns = extractNouns(line, matchAreNo);
        result = engine.queryAreNo(nouns[1], nouns[2]);
        console.log(result);
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
