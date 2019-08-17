/**
 * tokenizer.js
 * Takes in Lexemes and outputs Tokens.
 */

const { Token, TypeTokens, SpecialTokens } = require('./token');

class Tokenizer {
    constructor() {

    }

    splitTokens(word) {
        var tokens = [];

        console.log(word);

        function replaceString(src, pattern, replacement) {
            if (src.includes(pattern)) {
                var index = src.indexOf(pattern, 0);
                var patternLength = pattern.length;

                if(index == 0) {
                    
                } else if(index > 0) {
                    var sub1 = src.substring(0, index-1)
                }
            }
        }

        function readSpecialToken(src) {
            for (var e in SpecialTokens) {
                var sc = Object.entries(SpecialTokens[e]);
                var pattern = sc[0][1];
                var code = sc[1][1];

                if (src.includes(pattern)) {
                    console.log('prev: ' + src);
                    src = src.replace(pattern, ' ' + new Token(code, '') + ' ');
                    
                    console.log('after: ' + src);
                }
            }

            return src;
        }

        function readTypeToken(src) {
            for (var f in TypeTokens) {
                var tc = Object.entries(TypeTokens[f]);
                var pattern = tc[0][1];
                var code = tc[1][1];

                if (src == pattern) {
                    //console.log('prev: ' + t);
                    src = src.replace(pattern, ' ' + new Token(code, '') + ' ');
                    //console.log('after: ' + t);
                }
            }

            return src;
        }

        word = readSpecialToken(word);
        word = readTypeToken(word);

        tokens = word.split(' ');
        tokens = tokens.filter(f => f.trim().length != 0);

        // var tokenList = [];
        // for(var t=0; t<tokens.length; t++) {
        //     var newToken = new Token()
        // }

        return tokens;
    }
}

module.exports = {
    Tokenizer
};