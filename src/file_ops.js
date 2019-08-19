/**
 * file_ops.js
 * Standard file operations
 */

const fs = require('fs');

class FileOperations {
    constructor() {

    }

    // Read the given file and return a list of words per line.
    processFile(fileName) {

        // List of words to output;
        var result = [];

        // Character index in the file.
        var charIndex = 0;

        // Open the specified file for reading.
        function openFile() {
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

        // Split the given line of text into words using space as separator.
        function readWords(line) {
            var trimmedWords = [];
            var words = line.split(' ');

            for (var i = 0; i < words.length; i++) {
                if (words[i].trim().length == 0) {
                    continue;
                }

                trimmedWords.push(words[i]);
            }

            return trimmedWords;
        }

        // Open the file.
        var data = openFile(fileName);

        // Read the file.
        while(charIndex < data.length) {
            var dataLine = readLine(data);
            var wordsRead = readWords(dataLine);
    
            var line = [];
            for(var i=0; i<wordsRead.length; i++) {
                line.push(wordsRead[i]);
            }
            result.push(line);
        }

        return result;
    }
}

module.exports = {
    FileOperations
};