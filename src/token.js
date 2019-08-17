/**
 * token.js
 * Class definition for Tokens.
 */

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

var TypeTokens = {
    BOOLEAN: { pattern: 'bool', code: 100 },
    INTEGER: { pattern: 'int', code: 101 },
    FLOAT: { pattern: 'float', code: 102 },
    CHAR: { pattern: 'char', code: 103 }
}

var SpecialTokens = {
    L_CBRACE: { pattern: '{', code: 1 },
    R_CBRACE: { pattern: '}', code: 2 },
    L_BRACKET: { pattern: '[', code: 3 },
    R_BRACKET: { pattern: ']', code: 4 },
    L_PAREN: { pattern: '(', code: 5 },
    R_PAREN: { pattern: ')', code: 6 },
    D_EQUALS: { pattern: '==', code: 35 },
    N_EQUALS: { pattern: '!=', code: 36 },
    LTE_SYMBOL: { pattern: '<=', code: 9 },
    GTE_SYMBOL: { pattern: '>=', code: 10 },
    LT_SYMBOL: { pattern: '<', code: 7 },
    GT_SYMBOL: { pattern: '>', code: 8 },
    F_SLASH: { pattern: '/', code: 11 },
    B_SLASH: { pattern: '\\', code: 12 },
    COMMA: { pattern: ',', code: 13 },
    DOT: { pattern: '.', code: 14 },
    Q_MARK: { pattern: '?', code: 15 },
    COLON: { pattern: ':', code: 16 },
    SEMICOLOR: { pattern: ';', code: 17 },
    DOUBLEQUOTE: { pattern: '"', code: 18 },
    SINGLEQUOTE: { pattern: '\'', code: 19 },
    PIPE_SYMBOL: { pattern: '|', code: 20 },
    TILDE: { pattern: '~', code: 21 },
    BACKTICK: { pattern: '`', code: 22 },
    EXCLAMATION: { pattern: '!', code: 23 },
    AT_SYMBOL: { pattern: '@', code: 24 },
    HASH_SYMBOL: { pattern: '#', code: 25 },
    DOLLAR: { pattern: '$', code: 26 },
    PERCENT: { pattern: '%', code: 27 },
    HAT_SYMBOL: { pattern: '^', code: 28 },
    AMPERSAND: { pattern: '&', code: 29 },
    ASTERISK: { pattern: '*', code: 30 },
    UNDERSCORE: { pattern: '_', code: 31 },
    MINUS: { pattern: '-', code: 32 },
    PLUS: { pattern: '+', code: 33 },
    EQUAL: { pattern: '=', code: 34 },
    
}

module.exports = {
    Token,
    TypeTokens,
    SpecialTokens
};