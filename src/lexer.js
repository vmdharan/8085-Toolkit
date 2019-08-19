/**
 * lexer.js
 * Perform lexical analysis on the file and tokenize the strings.
 */

const { FileOperations } = require('./file_ops');
const { Tokenizer } = require('./tokenizer');

class Lexer {
    constructor() {

    }

    ReadFileAndGenerateTokens(fileName) {
        var fileOps = new FileOperations();
        var data = fileOps.processFile(fileName);
        var tokenizer = new Tokenizer();
        var tokens = [];
    
        //console.log(data);
    
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].length; j++) {
                tokenizer.splitTokens(data[i][j]).forEach(f => {
                    tokens.push(f);
                });
            }
        }

        return tokens;
    }
}

module.exports = {
    Lexer
};