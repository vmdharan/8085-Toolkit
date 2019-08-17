/*
 * lexer.js
 */

var fs = require('fs');
const { Tokenizer } = require('./tokenizer');
const { SpecialTokens, TypeTokens } = require('./token');

var charIndex = 0;

function openFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

// Read a line from the source file
function readLine(data) {
    var currentLine = '';

    for (var i = charIndex; i < data.length; i++) {
        // Read the newline symbol and handle depending on the scenario.
        if (data[i] == '\n') {
            // Characters have previously been read, so this is the 
            // end of the line. Break and return the string.
            if (currentLine != '') {
                break;
            }
            // This is a blank line, so continue reading.
            else {
                continue;
            }
            break;
        }
        // Carriage return, continue reading till the newline symbol.
        else if (data[i] == '\r') {
            continue;
        }
        // This is a valid char for the line.
        else {
            currentLine += data[i];
        }
    }

    charIndex = (i + 1);

    return currentLine;
}

function readTokens(line) {
    var words = line.split(' ');
    for(var i=0; i<words.length; i++) {
        if(words[i].trim().length == 0) {
            continue;
        }

        //console.log(words[i]);
        var tokens = splitTokens(words[i]);
        console.log(tokens);
    }
}

function splitTokens(token) {
    var tokens = [];

    // var specialChars = [
    //     '{', '}', '[', ']', '(', ')', '<', '>',
    //     '/', '\\', ',', '.', '?', ':', ';', '"', 
    //     '\'', '|', '~', '`', '!', '@', '#', '$', 
    //     '%', '^', '&', '*', '_', '-', '+', '=' 
    // ];
    var specialChars = [];
    for(var e in SpecialTokens) {
        var sc = Object.entries(SpecialTokens[e]);
        var pattern = sc[0][1];
        var code = sc[1][1];

        if(token.includes(pattern)) {
            console.log('prev: ' + token);
            token = token.replace(pattern, ' ' + code + ' ');
            console.log('after: ' + token);
        }
    };

    for(var t in token) {
        for(var f in TypeTokens)
        {
            var tc = Object.entries(TypeTokens[f]);
            var pattern = tc[0][1];
            var code = tc[1][1];

            if(t == pattern) {
                console.log('prev: ' + t);
                t = t.replace(pattern, ' ' + code + ' ');
                console.log('after: ' + t);
            }
        }
    }
    //console.log(specialChars);
    
    // for(var i=0; i<specialChars.length; i++) {
    //     if(token.includes(specialChars[i])) {
    //         token = token.replace(specialChars[i], ' ' + specialChars[i] + ' ');
    //     }
    // }

    tokens = token.split(' ');
    tokens = tokens.filter(f => f.trim().length != 0);

    tokens.forEach(e => {
        var x = new Tokenizer(e);
        console.log(x.type);
    });

    return tokens;
}

function doStuff() {
    var data = openFile('../data/tokens1.txt');

    while(charIndex < data.length) {
        var dataLine = readLine(data);
        readTokens(dataLine);
    }
}

doStuff();