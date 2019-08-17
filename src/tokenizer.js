/**
 * tokenizer.js
 * Takes in Lexemes and outputs Tokens.
 */

const { TypeTokens, SpecialTokens } = require('./token');

class Tokenizer {
    constructor() {

    }

    splitTokens(token) {
        var tokens = [];
        
        for (var e in SpecialTokens) {
            var sc = Object.entries(SpecialTokens[e]);
            var pattern = sc[0][1];
            var code = sc[1][1];

            if (token.includes(pattern)) {
                //console.log('prev: ' + token);
                token = token.replace(pattern, ' ' + code + ' ');
                //console.log('after: ' + token);
            }
        };

        for (var t in token) {
            for (var f in TypeTokens) {
                var tc = Object.entries(TypeTokens[f]);
                var pattern = tc[0][1];
                var code = tc[1][1];

                if (t == pattern) {
                    //console.log('prev: ' + t);
                    t = t.replace(pattern, ' ' + code + ' ');
                    //console.log('after: ' + t);
                }
            }
        }

        tokens = token.split(' ');
        tokens = tokens.filter(f => f.trim().length != 0);

        return tokens;
    }
}

module.exports = {
    Tokenizer
};