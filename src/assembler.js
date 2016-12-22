/*
 * assembler.js
 * Convert 8085 instructions to machine code.
 */

var asm = '8085 instructions';
console.log(asm);

var charIndex = 0;
var argIndex = 0;

fs = require('fs');

asm8085();



function asm8085() {
	this.srcFile = './data/8085test.dat';
	this.data = fs.readFileSync(this.srcFile, 'utf8');
	
	readData(this.data);
}

function readData(data) {
	var opcode, opcodeLine;
	var mcode = 0;

	while(charIndex < data.length) {
		argIndex = 0;
		
		opcodeLine = readLine(data);
		opcode = readWord(opcodeLine);
		
		console.log(opcodeLine);
		
		switch(opcode) {
		case 'mov': mcode = 0x01;
			console.log(opcode);
			console.log(readWord(opcodeLine));
			console.log(readWord(opcodeLine));
			break;
		default: break;
		}
		
		console.log('0x' + mcode.toString(16).slice(-2));
	}
}

/*
 * Read a line from the source file.
 * data - character stream containing assembly language instructions
 * (one instruction per line).
 */
function readLine(data) {
	var opcodeLine = '';
	
	for(var i = charIndex; i < data.length; i++) {
		if(data[i] == '\n') {
			break;
		}
		else if(data[i] == '\r') {
			continue;
		}
		else {
			opcodeLine += data[i];
		}
	}
	
	charIndex = (i+1);
	
	return opcodeLine;
}

/*
 * Parse opcodes given the instruction line.
 * data - a line containing an instruction for the 8085.
 */
function readWord(data) {
	var opcode = '';
	
	for(var i = argIndex; i < data.length; i++) {
		if(data[i] == '\n') {
			break;
		}
		else if(data[i] == '\r') {
			continue;
		}
		else if(data[i] == ' ') {
			// Stop because the character read is a space separator.
			if(opcode != '') {
				break;
			}
			// Ignore this as the first character read is a space.
			else {
				continue;
			}
		}
		else if(data[i] == ',') {
			break;
		}
		else {
			opcode += data[i];
		}
	}
	
	argIndex = (i+1);
	
	return opcode;
}