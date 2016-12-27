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
	//this.srcFile = './data/data_transfer_test.dat';
	//this.srcFile = './data/stack_io_test.dat';
	this.srcFile = './data/arithmetic_test.dat';
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
		 * Arithmetic Group
		 * ADD, ADI, ADC, ACI, SUB, SUI, SBB, SBI, INR, DCR, INX, DXC, 
		 * DAD, DAA
		 */
		case 'add':
			// Read the register for the addition.
			r1 = readWord(opcodeLine);
			
			/*
			 * ADD r
			 * (A) <- (A) + (r)
			 * Add register
			 */
			if(r1[0] == 'r') {
				sss = regToBitcode(r1);
				mcode = (0x08 << 4) | (sss);
			}
			
			/*
			 * ADD M
			 * (A) <- (A) + ((H)(L))
			 * Add memory
			 */
			else if(r1[0] == 'M') {
				mcode = (0x86);
			}
			
			else {
				console.log('[LOG] Error in ADD, r1 = ' + r1);
			}
			
			break;
			
		case 'adi':
			// Read the data byte for the addition.
			r1 = readWord(opcodeLine);
			
			/*
			 * ADI data
			 * (A) <- (A) + (byte2)
			 * Add immediate
			 */
			mcode = (0xc6);
			byte2 = r1;
			
			break;

		case 'adc':
			// Read the register for the addition.
			r1 = readWord(opcodeLine);
			
			/*
			 * ADC r
			 * (A) <- (A) + (r) + (CY)
			 * Add register with carry
			 */
			if(r1[0] == 'r') {
				sss = regToBitcode(r1);
				mcode = (0x08 << 4) | (0x01 << 3) | (sss);
			}
			
			/*
			 * ADC M
			 * (A) <- (A) + ((H)(L)) + (CY)
			 * Add memory with carry
			 */
			else if(r1[0] == 'M') {
				mcode = (0x8e);
			}
			
			else {
				console.log('[LOG] Error in ADC, r1 = ' + r1);
			}
			
			break;

		case 'aci':
			// Read the data byte for the addition.
			r1 = readWord(opcodeLine);
			
			/*
			 * ACI data
			 * (A) <- (A) + (byte2) + (CY)
			 * Add immediate with carry
			 */
			mcode = (0xce);
			byte2 = r1;
			
			break;

		case 'sub':
			// Read the register for the subtraction.
			r1 = readWord(opcodeLine);
			
			/*
			 * SUB r
			 * (A) <- (A) - (r)
			 * Subtract register
			 */
			if(r1[0] == 'r') {
				sss = regToBitcode(r1);
				mcode = (0x09 << 4) | (sss);
			}
			
			/*
			 * SUB M
			 * (A) <- (A) - ((H)(L))
			 * Subtract memory
			 */
			else if(r1[0] == 'M') {
				mcode = (0x96);
			}
			
			else {
				console.log('[LOG] Error in SUB, r1 = ' + r1);
			}
			
			break;

		case 'sui':
			// Read the data byte for the subtraction.
			r1 = readWord(opcodeLine);
			
			/*
			 * SUI data
			 * (A) <- (A) - (byte2)
			 * Subtract immediate
			 */
			mcode = (0xd6);
			byte2 = r1;
			
			break;

		case 'sbb':
			// Read the register for the subtraction.
			r1 = readWord(opcodeLine);
			
			/*
			 * SBB r
			 * (A) <- (A) - (r) - (CY)
			 * Subtract register with borrow
			 */
			if(r1[0] == 'r') {
				sss = regToBitcode(r1);
				mcode = (0x09 << 4) | (0x01 << 3) | (sss);
			}
			
			/*
			 * SBB M
			 * (A) <- (A) - ((H)(L)) - (CY)
			 * Subtract memory with borrow
			 */
			else if(r1[0] == 'M') {
				mcode = (0x9e);
			}
			
			else {
				console.log('[LOG] Error in SBB, r1 = ' + r1);
			}
			
			break;

		case 'sbi':
			// Read the data byte for the subtraction.
			r1 = readWord(opcodeLine);
			
			/*
			 * SBI data
			 * (A) <- (A) - (byte2) - (CY)
			 * Subtract immediate with borrow
			 */
			mcode = (0xde);
			byte2 = r1;
			
			break;

		case 'inr':
			break;
			
		case 'dcr':
			break;

		case 'inx':
			break;
			
		case 'dxc':
			break;
			
		case 'dad':
			break;
			
		case 'daa':
			break;
			
		/*
		 * Logical Group
		 * ANA, ANI, XRA, XRI, ORA, ORI, CMP, CPI, RLC, RRC, RAL, RAR, 
		 * CMA, CMC, STC
		 */
			
		/*
		 * Branch Group
		 * JMP, Jcondition, CALL, Ccondition, RET, Rcondition, RST, PCHL
		 */
			
		/*
		 * Stack, I/O and Machine Control Group
		 * PUSH, POP, XTHL, SPHL, IN, OUT, EI, DI, HLT, NOP, RIM, SIM
		 */
			
		case 'push':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			
			/*
			 * PUSH rp
			 * ((SP) - 1) <- (rh)
			 * ((SP) - 2) <- (rl)
			 * (SP) <- (SP) - 2
			 * Push
			 * Note: rp = SP may not be specified.
			 */
			if(r1 == 'SP') {
				console.log('[LOG] Error in Push instruction, rp = ' + r1);
			}
			
			else if((r1 == 'BC') || (r1 == 'DE') || (r1 == 'HL')) {
				rp = rpToBitcode(r1);
				mcode = (0x03 << 6) | (rp << 4) | (0x05);
			}
			
			/*
			 * PUSH PSW
			 * ((SP) - 1) <- (A)
			 * ((SP) - 2)0 <- (CY), ((SP) - 2)1 <- X
			 * ((SP) - 2)2 <- (P), ((SP) - 2)3 <- X
			 * ((SP) - 2)4 <- (AC), ((SP) - 2)5 <- X
			 * ((SP) - 2)6 <- (Z), ((SP) - 2)7 <- (S)
			 * (SP) <- (SP) - 2, X: Undefined
			 * Push processor status word
			 */
			else if(r1 == 'PSW') {
				// Case where the rp == SP (bitcode 11).
				//mcode = (0x03 << 6) | (0x03 << 4) | (0x05);
				mcode = 0xf5;
			}
			
			break;
			
		case 'pop':
			// Read the arguments for the opcode.
			r1 = readWord(opcodeLine);
			
			/*
			 * POP rp
			 * (rl) <- ((SP))
			 * (rh) <- ((SP) + 1)
			 * (SP) <- ((SP) + 2)
			 * Pop
			 * Note: rp = SP may not be specified.
			 */
			if(r1 == 'SP') {
				console.log('[LOG] Error in Pop instruction, rp = ' + r1);
			}
			
			else if((r1 == 'BC') || (r1 == 'DE') || (r1 == 'HL')) {
				rp = rpToBitcode(r1);
				mcode = (0x03 << 6) | (rp << 4) | (0x01);
			}
			
			/*
			 * POP PSW
			 * (CY) <- ((SP))0
			 * (P) <- ((SP))2
			 * (AC) <- ((SP))4
			 * (Z) <- ((SP))6
			 * (S) <- ((SP))7
			 * (A) <- ((SP) + 1)
			 * (SP) <- (SP) + 2
			 * Pop processor status word.
			 */
			else if(r1 == 'PSW') {
				// Case where the rp == SP (bitcode 11).
				mcode = 0xf1;
			}
			
			break;
			
		case 'xthl':
			/*
			 * XTHL
			 * (L) <-> ((SP))
			 * (H) <-> ((SP) + 1)
			 * Exchange stack top with H
			 */
			mcode = 0xe3;
			break;
			
		case 'sphl':
			/*
			 * SPHL
			 * (SP) <- (H)(L)
			 * Move HL to SP
			 */
			mcode = 0xf9;
			break;
			
		case 'in':
			// Read the port.
			r1 = readWord(opcodeLine);
			
			/*
			 * IN port
			 * (A) <- (data)
			 * Input
			 */
			mcode = 0xdb;
			byte2 = r1;
			
			break;
			
		case 'out':
			// Read the port.
			r1 = readWord(opcodeLine);
			
			/*
			 * OUT port
			 * (data) <- (A)
			 * Output
			 */
			mcode = 0xd3;
			byte2 = r1;
			
			break;
			
		case 'ei':
			/*
			 * EI
			 * Enable interrupts
			 */
			mcode = 0xfb;
			break;
			
		case 'di':
			/*
			 * DI
			 * Disable interrupts
			 */
			mcode = 0xf3;
			break;
			
		case 'hlt':
			/*
			 * HLT
			 * Halt
			 */
			mcode = 0x76;
			break;
			
		case 'nop':
			/*
			 * NOP
			 * No-op
			 */
			mcode = 0x00;
			break;
			
		case 'rim':
			/*
			 * RIM
			 * Read Interrupt Masks
			 */
			mcode = 0x20;
			break;
			
		case 'sim':
			/*
			 * SIM
			 * Set Interrupt Masks
			 */
			mcode = 0x30;
			break;
			
		/*
		 * Default case - should not occur except where an opcode 
		 * is specified in the source that has not been implemented.
		 */	
		default:
			console.log('[LOG] opcode not valid.')
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