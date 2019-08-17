/**
 * tokenizer.js
 * Takes in Lexemes and outputs Tokens.
 */

const { TypeTokens, SpecialTokens } = require('./token');

class Tokenizer {
    constructor(lexeme) {
        var t = '';

        switch(lexeme) {
            case TypeTokens.BOOLEAN.pattern: t = TypeTokens.BOOLEAN.code; break;
            case TypeTokens.INTEGER.pattern: t = TypeTokens.INTEGER.code; break;
            case TypeTokens.FLOAT.pattern: t = TypeTokens.FLOAT.code; break;
            case TypeTokens.CHAR.pattern: t = TypeTokens.CHAR.code; break;

            default: t = "Unknown"; break;
        }

        this.type = t;
    }
}

module.exports = {
    Tokenizer
};