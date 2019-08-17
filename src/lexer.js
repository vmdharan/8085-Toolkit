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
    var tokens = [];
    var words = line.split(' ');

    for(var i=0; i<words.length; i++) {
        if(words[i].trim().length == 0) {
            continue;
        }

        tokens.push(words[i]);
        //console.log(words[i]);
        //var tokens = splitTokens(words[i]);
        //console.log(tokens);
    }

    return tokens;
}

function doStuff() {
    var data = openFile('../data/tokens1.txt');
    var tokenizer = new Tokenizer();

    while(charIndex < data.length) {
        var dataLine = readLine(data);
        var tokensRead = readTokens(dataLine);
        for(var i=0; i<tokensRead.length; i++) {
            var tokens = tokenizer.splitTokens(tokensRead[i]);
            console.log(tokens);
        }
    }
}

doStuff();