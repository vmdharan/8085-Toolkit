/**
 * compiler.js
 * Main entry point for the compiler.
 */

 const { Lexer } = require('./lexer');
 const parser = require('./parser');

function doStuff() {
    var lexer = new Lexer();
    var tokens = lexer.ReadFileAndGenerateTokens('../data/tokens1.txt');

    console.log(tokens);
}

doStuff();
