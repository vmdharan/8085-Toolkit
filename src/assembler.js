/*
 * assembler.js
 * Convert 8085 instructions to machine code.
 */

// Print out test line.
var asm = '8085 instructions';
console.log(asm);

var charIndex = 0; // Index in the data stream (global).
var argIndex = 0;  // Index in the instruction line.

fs = require('fs');

// Execute
asm8085();


/*
 * Main entry point for the 8085 assembler.
 */
function asm8085() {
	this.srcFile = './data/8085test.dat';
	this.data = fs.readFileSync(this.srcFile, 'utf8');
	
	readData(this.data);
}

/*
 * Determine the bitcode for a given register.
 * reg - Register
 */
function regToBitcode(reg) {
	var bits;
	
	switch(reg) {
	case 'rA': bits = 0x07; break;
	case 'rB': bits = 0x00; break;
	case 'rC': bits = 0x01; break;
	case 'rD': bits = 0x02; break;
	case 'rE': bits = 0x03; break;
	case 'rH': bits = 0x04; break;
	case 'rL': bits = 0x05; break;
	default: console.log('[LOG] Error in regToBitcode, reg value: ' + reg);
		break;
	}
	
	return bits;
}

/*
 * Read and parse 8085 assembly language instructions from the data stream.
 * data - character stream.
 */
function readData(data) {
	var opcode, opcodeLine;
	var mcode = 0;

	while(charIndex < data.length) {
		argIndex = 0;
		
		opcodeLine = readLine(data);
		opcode = readWord(opcodeLine);
		
		console.log(opcodeLine);
		
		switch(opcode) {
		case 'mov': 
			/*
			 * MOV r1, r2
			 */
			var r1 = readWord(opcodeLine);
			var r2 = readWord(opcodeLine);
			
			var ddd = regToBitcode(r1);
			var sss = regToBitcode(r2);
			
			mcode = (0x01 << 6) | (ddd << 3) | (sss);
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
	// Variable to hold the characters in the opcode line.
	var opcodeLine = '';
	
	for(var i = charIndex; i < data.length; i++) {
		// End of the line, so break and return the line that was parsed.
		if(data[i] == '\n') {
			break;
		}
		// Carriage return, continue reading till the newline symbol.
		else if(data[i] == '\r') {
			continue;
		}
		// This is a valid char for the opcode line.
		else {
			opcodeLine += data[i];
		}
	}
	
	charIndex = (i+1);
	
	return opcodeLine;
}

/*
 * Parse opcodes and their arguments given the instruction line.
 * data - a line containing an instruction for the 8085.
 */
function readWord(data) {
	// Variable to hold the opcode and/or their arguments.
	var opcode = '';
	
	for(var i = argIndex; i < data.length; i++) {
		// End of the line, break and return the opcode.
		if(data[i] == '\n') {
			break;
		}
		// Carriage return, continue reading till the newline symbol.
		else if(data[i] == '\r') {
			continue;
		}
		// Read a space char, check the scenario and handle accordingly.
		else if(data[i] == ' ') {
			// Characters have previously been read, so this is 
			// a space separator. Break and return the opcode.
			if(opcode != '') {
				break;
			}
			// Continue reading, as the opcode stream is still empty.
			else {
				continue;
			}
		}
		// This is a comma separator, break and return the opcode.
		else if(data[i] == ',') {
			break;
		}
		// This is a char belonging to the opcode.
		else {
			opcode += data[i];
		}
	}
	
	argIndex = (i+1);
	
	return opcode;
}