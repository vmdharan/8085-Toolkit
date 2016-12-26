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
 * Determine the bitcode a given register pair.
 * rp - Register pair
 */
function rpToBitcode(rp) {
	var bits;
	
	switch(rp) {
	case 'BC': bits = 0x00; break;
	case 'DE': bits = 0x01; break;
	case 'HL': bits = 0x02; break;
	case 'SP': bits = 0x03; break;
	default: console.log('[LOG] Error in rpToBitcode, rp value: ' + rp);
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
	
	// Registers or arguments to opcodes.
	var r1 = '';
	var r2 = '';
	var r3 = '';
	
	// Register pair bitcode.
	var rp = 0x00;
	
	// Destination register.
	var ddd = 0x00;
	
	// Source register.
	var sss = 0x00;
	
	// Data bytes.
	var byte2 = 0x00;
	var byte3 = 0x00;

	while(charIndex < data.length) {
		argIndex = 0;
		mcode = 0x00;
		
		r1 = '';
		r2 = '';
		r3 = '';
		rp = 0x00;
		ddd = 0x00;
		sss = 0x00;
		byte2 = 0x00;
		byte3 = 0x00;
		
		opcodeLine = readLine(data);
		opcode = readWord(opcodeLine);
		
		console.log(opcodeLine);
		
		switch(opcode) {
		
		/*
		 * Data Transfer Group
		 * MOV, MVI, LXI, LDA, STA, LHLD, SHLD, LDAX, STAX, XCHG
		 */
		
		/*
		 * Move instructions.
		 * 1 - Register to register
		 * 2 - Memory to register
		 * 3 - Register to memory
		 */
		case 'mov': 
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			
			/*
			 * MOV r1, r2
			 * (r1) <- (r2)
			 * Move Register
			 */
			if((r1[0] == 'r') && (r2[0] == 'r')) {
				ddd = regToBitcode(r1);
				sss = regToBitcode(r2);
				mcode = (0x01 << 6) | (ddd << 3) | (sss);
			}
			
			/*
			 * MOV r, M
			 * (r) <- ((H)(L))
			 * Move from memory
			 */
			else if((r1[0] == 'r') && (r2[0] == 'M')) {
				ddd = regToBitcode(r1);
				mcode = (0x01 << 6) | (ddd << 3) | (0x06);
			}
			
			/*
			 * MOV M, r
			 * ((H)(L)) <- (r)
			 * Move to memory
			 */
			else if((r1[0] == 'M') && (r2[0] == 'r')) {
				sss = regToBitcode(r2);
				mcode = (0x01 << 6) | (0x06 << 3) | (sss);
			}
			
			break;
		
		case 'mvi':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			
			/*
			 * MVI r, data
			 * (r) <- (byte 2)
			 * Move immediate
			 */
			if(r1[0] == 'r') {
				ddd = regToBitcode(r1);
				mcode = (0x00 << 6) | (ddd << 3) | (0x06);
				byte2 = r2;
			}
			
			/*
			 * MVI M, data
			 * ((H)(L)) <- (byte 2)
			 * Move to memory immediate
			 */
			else if(r1[0] == 'M') {
				mcode = (0x00 << 6) | (0x06 << 3) | (0x06);
				byte2 = r2;
			}
			
			break;
		
		case 'lxi':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			r3 = readWord(opcodeLine);
			
			/*
			 * LXI rp, data16
			 * (rh) <- (byte3)
			 * (rl) <- (byte2)
			 * Load register pair immediate
			 */
			rp = rpToBitcode(r1);
			mcode = (0x00 << 6) | (rp << 4) | (0x01);
			byte2 = r2;
			byte3 = r3;
			
			break;
		
		case 'lda':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			
			/*
			 * LDA addr
			 * (A) <- ((byte3)(byte2))
			 * Load Accumulator direct
			 */
			mcode = (0x3a);
			byte2 = r1;
			byte3 = r2;
			
			break;
		
		case 'sta':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			
			/*
			 * STA addr
			 * ((byte3)(byte2)) <- (A)
			 * Store Accumulator direct
			 */
			mcode = (0x32);
			byte2 = r1;
			byte3 = r2;
			
			break;
		
		case 'lhld':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			
			/*
			 * LHLD addr
			 * (L) <- ((byte3)(byte2))
			 * (H) <- ((byte3)(byte2) + 1)
			 * Load H and L direct
			 */
			mcode = (0x2a);
			byte2 = r1;
			byte3 = r2;
			
			break;
			
		case 'shld':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			r2 = readWord(opcodeLine);
			
			/*
			 * SHLD addr
			 * ((byte3)(byte2)) <- (L)
			 * ((byte3)(byte2) + 1) <- (H)
			 * Store H and L direct
			 */
			mcode = (0x22);
			byte2 = r1;
			byte3 = r2;
			
			break;
			
		case 'ldax':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			
			/*
			 * LDAX rp
			 * (A) <- ((rp))
			 * Load accumulator indirect
			 */
			rp = rpToBitcode(r1);
			mcode = (0x00 << 6) | (rp << 4) | (0x0a);
			
			break;
		
		case 'stax':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			
			/*
			 * STAX rp
			 * ((rp)) <- (A)
			 * Store accumulator indirect
			 */
			rp = rpToBitcode(r1);
			mcode = (0x00 << 6) | (rp << 4) | (0x02);
			
			break;
			
		case 'xchg':
			/*
			 * XCHG
			 * (H) <-> (D)
			 * (L) <-> (E)
			 * Exchange H and L with D and E.
			 */
			mcode = (0xeb);
			
			break;
			
		/*
		 * Stack, I/O and Machine Control Group
		 * PUSH, POP, XTHL, SPHL, IN, OUT, EI, DI, HLT, NOP, RIM, SIM
		 */
		case 'push':
			break;
			
		case 'pop':
			break;
			
		case 'xthl':
			break;
			
		case 'sphl':
			break;
			
		case 'in':
			break;
			
		case 'out':
			break;
			
		case 'ei':
			break;
			
		case 'di':
			break;
			
		case 'hlt':
			break;
			
		case 'nop':
			break;
			
		case 'rim':
			break;
			
		case 'sim':
			break;
			
		/*
		 * Default case - should not occur except where an opcode 
		 * is specified in the source that has not been implemented.
		 */	
		default:
			mcode = 0x00;
			break;
		}

		console.log('0x' + ('00' + mcode.toString(16)).slice(-2));
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
		// Read the newline symbol and handle depending on the scenario.
		if(data[i] == '\n') {
			// Characters have previously been read, so this is the 
			// end of the line. Break and return the opcode.
			if(opcodeLine != '') {
				break;
			}
			// This is a blank line, so continue reading.
			else {
				continue;
			}
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