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

        function isSpecialToken(src) {
            for (var e in SpecialTokens) {
                var sc = Object.entries(SpecialTokens[e]);
                var pattern = sc[0][1];
                var code = sc[1][1];

                if (pattern.includes(src)) {
                    return true;
                }
            }
            return false;
        }

        function checkSpecialToken(src) {
            for (var e in SpecialTokens) {
                var sc = Object.entries(SpecialTokens[e]);
                var pattern = sc[0][1];
                var code = sc[1][1];

                if (src == pattern) {
                    return code;
                }
            }

            return -1;
        }

        function checkTypeToken(src) {
            for (var f in TypeTokens) {
                var tc = Object.entries(TypeTokens[f]);
                var pattern = tc[0][1];
                var code = tc[1][1];

                if (src == pattern) {
                    return code;
                }
            }

            return -1;
        }

        // Returns true if the input ASCII code is a digit.
        // ASCII code '0' starts at 48 and continues to '9' which is 57.
        function isDigit(c) {
            if (c >= 48 && c < 58) {
                return true;
            }
            return false;
        }

        // Returns true if the input ASCII code is an alphabet / letter.
        // ASCII code 'A' starts at 65 and continues to 'Z' which is 90.
        // ASCII code 'a' starts at 97 and continues to 'z' which is 122.
        function isAlpha(c) {
            if ((c >= 65 && c < 91) || (c >= 97 && c < 123)) {
                return true;
            }
            return false;
        }

        // Returns true if the input ASCII code is an underscore character.
        // ASCII code for underscore '_' is 95.
        function isUnderscore(c) {
            if (c == 95) {
                return true;
            }
            return false;
        }

        // Returns true if the input ASCII code is alphanumeric, containing 
        // only letters and digits.
        // ASCII code '0' starts at 48 and continues to '9' which is 57.
        // ASCII code 'A' starts at 65 and continues to 'Z' which is 90.
        // ASCII code 'a' starts at 97 and continues to 'z' which is 122.
        function isAlphaNumeric(c) {
            if ((c >= 48 && c < 58) || (c >= 65 && c < 91) || (c >= 97 && c < 123)) {
                return true;
            }
            return false;
        }

        // Returns true if the input ASCII code is alphanumeric, containing 
        // only letters, digits and underscore.
        // ASCII code '0' starts at 48 and continues to '9' which is 57.
        // ASCII code 'A' starts at 65 and continues to 'Z' which is 90.
        // ASCII code 'a' starts at 97 and continues to 'z' which is 122.
        // ASCII code for underscore '_' is 95.
        function isAlphaNumericOrUnderscore(c) {
            if ((c >= 48 && c < 58) || (c >= 65 && c < 91) || (c >= 97 && c < 123) || (c == 95)) {
                return true;
            }
            return false;
        }

        // Returns true if the provided string has valid chars for a number.
        // ASCII code '-' is 45, code '.' is 46.
        function isMinusSign(c) {
            if (c == 45) {
                return true;
            }
            return false;
        }

        function isPeriodSign(c) {
            if (c == 46) {
                return true;
            }
            return false;
        }

        function readChars(src) {
            var buffer = '';

            for (var i = 0; i < src.length; i++) {
                var c = src.charCodeAt(i);

                // Check if this is a number
                if ((buffer.length == 0) && (isDigit(c))) {
                    buffer = src[i];

                    var j = i + 1;
                    while (j < src.length) {
                        var n = buffer + src[j];

                        if (!isNaN(n) || isPeriodSign(src[j])) {
                            buffer = n;
                            j++;
                        } else {
                            if (!isNaN(buffer)) {
                                tokens.push(new Token('number', buffer));
                                buffer = '';

                                i = j - 1;
                                buffer = '*';
                            }
                            break;
                        }
                    }
                    if (buffer.length > 0 && buffer != '*') {
                        if (!isNaN(buffer)) {
                            tokens.push(new Token('number', buffer));
                            buffer = '';
                        } else {
                            buffer = '';
                        }

                        continue;
                    }
                    else if (buffer == '*')
                    {
                        buffer = '';
                        continue;
                    }
                }

                if (isAlphaNumericOrUnderscore(c)) {
                    buffer += src[i];
                } else {
                    // Write buffer containing alphanumeric characters.
                    if (buffer.length > 0) {

                        // Check if type token.
                        var typeCode = checkTypeToken(buffer);
                        if (typeCode > 0) {
                            tokens.push(new Token('type', typeCode));
                        } else {
                            tokens.push(new Token('text', buffer));
                        }
                    }

                    // Check for special characters.
                    var sc = src[i];
                    if (isSpecialToken(sc)) {
                        // Check whether there is an addition character in the list.
                        if ((i + 1) < src.length) {
                            var sc2 = sc + src[i + 1];

                            if (isSpecialToken(sc2)) {
                                buffer = sc2;
                                i++;
                            } else {
                                buffer = sc;
                            }
                        } else {
                            buffer = sc;
                        }

                        var tk = checkSpecialToken(buffer);
                        if (tk > 0) {
                            tokens.push(new Token('special', tk));
                        } else {
                            tokens.push(new Token('error', tk));
                        }

                        buffer = '';
                    } else {
                        // Encountered a character that is not supported.
                        tokens.push(new Token('unknown', sc));
                        buffer = '';
                    }
                }
            }

            // Save buffer
            if (buffer.length > 0) {

                // Check if type token.
                var typeCode = checkTypeToken(buffer);
                if (typeCode > 0) {
                    tokens.push(new Token('type', typeCode));
                } else {
                    tokens.push(new Token('text', buffer));
                }
            }
        }

        readChars(word);

        return tokens;
    }
}

module.exports = {
    Tokenizer
};