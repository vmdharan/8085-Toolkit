/**
 * lexer.js
 * Perform lexical analysis on the file and tokenize the strings.
 */

const { FileOperations } = require('./file_ops');
const { Tokenizer } = require('./tokenizer');

function ReadFileAndGenerateTokens() {
    var fileOps = new FileOperations();
    var data = fileOps.processFile('../data/tokens1.txt');
    var tokenizer = new Tokenizer();
    var tokens = [];

    for(var i=0; i<data.length; i++) {
        for(var j=0; j<data[i].length; j++) {
            tokenizer.splitTokens(data[i][j]).forEach(f => {
                tokens.push(f);
            });
        }
    }
    
    console.log(tokens);

    return tokens;
}

ReadFileAndGenerateTokens();