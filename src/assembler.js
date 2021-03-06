/*
 * assembler.js
 * Convert 8085 instructions to machine code.
 */

class Assembler8085 {
	constructor() {
		this.charIndex = 0; // Index in the data stream (global).
		this.argIndex = 0;  // Index in the instruction line.
	}

	/*
 	 * Determine the bitcode for a given register.
 	 * reg - Register
 	 */
	regToBitcode(reg) {
		var bits;

		switch (reg) {
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
	 * Determine the bitcode for a condition.
	 * cond - condition
	 */
	condToBitcode(cond) {
		var bits;

		switch (cond) {
			case 'nz': bits = 0x00; break;
			case 'z': bits = 0x01; break;
			case 'nc': bits = 0x02; break;
			case 'c': bits = 0x03; break;
			case 'po': bits = 0x04; break;
			case 'pe': bits = 0x05; break;
			case 'p': bits = 0x06; break;
			case 'm': bits = 0x07; break;
			default: console.log('[LOG] Error in condToBitcode, cond value: ' + cond);
				break;
		}

		return bits;
	}


	/*
	 * Determine the bitcode a given register pair.
	 * rp - Register pair
	 */
	rpToBitcode(rp) {
		var bits;

		switch (rp) {
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
	 * Read a line from the source file.
	 * data - character stream containing assembly language instructions
	 * (one instruction per line).
	 */
	readLine(data) {
		// Variable to hold the characters in the opcode line.
		var opcodeLine = '';

		for (var i = this.charIndex; i < data.length; i++) {
			// Read the newline symbol and handle depending on the scenario.
			if (data[i] == '\n') {
				// Characters have previously been read, so this is the 
				// end of the line. Break and return the opcode.
				if (opcodeLine != '') {
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
			// This is a valid char for the opcode line.
			else {
				opcodeLine += data[i];
			}
		}

		this.charIndex = (i + 1);

		return opcodeLine;
	}

	/*
	 * Parse opcodes and their arguments given the instruction line.
	 * data - a line containing an instruction for the 8085.
	 */
	readWord(data) {
		// Variable to hold the opcode and/or their arguments.
		var opcode = '';
 
		for (var i = this.argIndex; i < data.length; i++) {
			// End of the line, break and return the opcode.
			if (data[i] == '\n') {
				break;
			}
			// Carriage return, continue reading till the newline symbol.
			else if (data[i] == '\r') {
				continue;
			}
			// Read a space char, check the scenario and handle accordingly.
			else if (data[i] == ' ') {
				// Characters have previously been read, so this is 
				// a space separator. Break and return the opcode.
				if (opcode != '') {
					break;
				}
				// Continue reading, as the opcode stream is still empty.
				else {
					continue;
				}
			}
			// This is a comma separator, break and return the opcode.
			else if (data[i] == ',') {
				break;
			}
			// This is a char belonging to the opcode.
			else {
				opcode += data[i];
			}
		}

		this.argIndex = (i + 1);

		return opcode;
	}

	/*
 	 * Read and parse 8085 assembly language instructions from the data stream.
 	 * data - character stream.
 	 */
	readData(data) {
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

		// Condition bits.
		var ccc = 0x00;

		while (this.charIndex < data.length) {
			this.argIndex = 0;
			mcode = 0x00;

			r1 = '';
			r2 = '';
			r3 = '';
			rp = 0x00;
			ddd = 0x00;
			sss = 0x00;
			ccc = 0x00;
			byte2 = 0x00;
			byte3 = 0x00;

			opcodeLine = this.readLine(data);
			opcode = this.readWord(opcodeLine);

			console.log(opcodeLine);

			switch (opcode) {

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
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * MOV r1, r2
					 * (r1) <- (r2)
					 * Move Register
					 */
					if ((r1[0] == 'r') && (r2[0] == 'r')) {
						ddd = this.regToBitcode(r1);
						sss = this.regToBitcode(r2);
						mcode = (0x01 << 6) | (ddd << 3) | (sss);
					}

					/*
					 * MOV r, M
					 * (r) <- ((H)(L))
					 * Move from memory
					 */
					else if ((r1[0] == 'r') && (r2[0] == 'M')) {
						ddd = this.regToBitcode(r1);
						mcode = (0x01 << 6) | (ddd << 3) | (0x06);
					}

					/*
					 * MOV M, r
					 * ((H)(L)) <- (r)
					 * Move to memory
					 */
					else if ((r1[0] == 'M') && (r2[0] == 'r')) {
						sss = this.regToBitcode(r2);
						mcode = (0x01 << 6) | (0x06 << 3) | (sss);
					}

					break;

				case 'mvi':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * MVI r, data
					 * (r) <- (byte 2)
					 * Move immediate
					 */
					if (r1[0] == 'r') {
						ddd = this.regToBitcode(r1);
						mcode = (0x00 << 6) | (ddd << 3) | (0x06);
						byte2 = r2;
					}

					/*
					 * MVI M, data
					 * ((H)(L)) <- (byte 2)
					 * Move to memory immediate
					 */
					else if (r1[0] == 'M') {
						mcode = (0x00 << 6) | (0x06 << 3) | (0x06);
						byte2 = r2;
					}

					break;

				case 'lxi':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					r3 = this.readWord(opcodeLine);

					/*
					 * LXI rp, data16
					 * (rh) <- (byte3)
					 * (rl) <- (byte2)
					 * Load register pair immediate
					 */
					rp = this.rpToBitcode(r1);
					mcode = (0x00 << 6) | (rp << 4) | (0x01);
					byte2 = r2;
					byte3 = r3;

					break;

				case 'lda':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * LDA addr
					 * (A) <- ((byte3)(byte2))
					 * Load Accumulator direct
					 */
					mcode = 0x3a;
					byte2 = r1;
					byte3 = r2;

					break;

				case 'sta':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * STA addr
					 * ((byte3)(byte2)) <- (A)
					 * Store Accumulator direct
					 */
					mcode = 0x32;
					byte2 = r1;
					byte3 = r2;

					break;

				case 'lhld':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * LHLD addr
					 * (L) <- ((byte3)(byte2))
					 * (H) <- ((byte3)(byte2) + 1)
					 * Load H and L direct
					 */
					mcode = 0x2a;
					byte2 = r1;
					byte3 = r2;

					break;

				case 'shld':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * SHLD addr
					 * ((byte3)(byte2)) <- (L)
					 * ((byte3)(byte2) + 1) <- (H)
					 * Store H and L direct
					 */
					mcode = 0x22;
					byte2 = r1;
					byte3 = r2;

					break;

				case 'ldax':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);

					/*
					 * LDAX rp
					 * (A) <- ((rp))
					 * Load accumulator indirect
					 */
					rp = this.rpToBitcode(r1);
					mcode = (0x00 << 6) | (rp << 4) | (0x0a);

					break;

				case 'stax':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);

					/*
					 * STAX rp
					 * ((rp)) <- (A)
					 * Store accumulator indirect
					 */
					rp = this.rpToBitcode(r1);
					mcode = (0x00 << 6) | (rp << 4) | (0x02);

					break;

				case 'xchg':
					/*
					 * XCHG
					 * (H) <-> (D)
					 * (L) <-> (E)
					 * Exchange H and L with D and E.
					 */
					mcode = 0xeb;

					break;

				/*
				 * Arithmetic Group
				 * ADD, ADI, ADC, ACI, SUB, SUI, SBB, SBI, INR, DCR, INX, DCX, 
				 * DAD, DAA
				 */
				case 'add':
					// Read the register for the addition.
					r1 = this.readWord(opcodeLine);

					/*
					 * ADD r
					 * (A) <- (A) + (r)
					 * Add register
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x08 << 4) | (sss);
					}

					/*
					 * ADD M
					 * (A) <- (A) + ((H)(L))
					 * Add memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0x86;
					}

					else {
						console.log('[LOG] Error in ADD, r1 = ' + r1);
					}

					break;

				case 'adi':
					// Read the data byte for the addition.
					r1 = this.readWord(opcodeLine);

					/*
					 * ADI data
					 * (A) <- (A) + (byte2)
					 * Add immediate
					 */
					mcode = 0xc6;
					byte2 = r1;

					break;

				case 'adc':
					// Read the register for the addition.
					r1 = this.readWord(opcodeLine);

					/*
					 * ADC r
					 * (A) <- (A) + (r) + (CY)
					 * Add register with carry
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x08 << 4) | (0x01 << 3) | (sss);
					}

					/*
					 * ADC M
					 * (A) <- (A) + ((H)(L)) + (CY)
					 * Add memory with carry
					 */
					else if (r1[0] == 'M') {
						mcode = 0x8e;
					}

					else {
						console.log('[LOG] Error in ADC, r1 = ' + r1);
					}

					break;

				case 'aci':
					// Read the data byte for the addition.
					r1 = this.readWord(opcodeLine);

					/*
					 * ACI data
					 * (A) <- (A) + (byte2) + (CY)
					 * Add immediate with carry
					 */
					mcode = 0xce;
					byte2 = r1;

					break;

				case 'sub':
					// Read the register for the subtraction.
					r1 = this.readWord(opcodeLine);

					/*
					 * SUB r
					 * (A) <- (A) - (r)
					 * Subtract register
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x09 << 4) | (sss);
					}

					/*
					 * SUB M
					 * (A) <- (A) - ((H)(L))
					 * Subtract memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0x96;
					}

					else {
						console.log('[LOG] Error in SUB, r1 = ' + r1);
					}

					break;

				case 'sui':
					// Read the data byte for the subtraction.
					r1 = this.readWord(opcodeLine);

					/*
					 * SUI data
					 * (A) <- (A) - (byte2)
					 * Subtract immediate
					 */
					mcode = 0xd6;
					byte2 = r1;

					break;

				case 'sbb':
					// Read the register for the subtraction.
					r1 = this.readWord(opcodeLine);

					/*
					 * SBB r
					 * (A) <- (A) - (r) - (CY)
					 * Subtract register with borrow
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x09 << 4) | (0x01 << 3) | (sss);
					}

					/*
					 * SBB M
					 * (A) <- (A) - ((H)(L)) - (CY)
					 * Subtract memory with borrow
					 */
					else if (r1[0] == 'M') {
						mcode = 0x9e;
					}

					else {
						console.log('[LOG] Error in SBB, r1 = ' + r1);
					}

					break;

				case 'sbi':
					// Read the data byte for the subtraction.
					r1 = this.readWord(opcodeLine);

					/*
					 * SBI data
					 * (A) <- (A) - (byte2) - (CY)
					 * Subtract immediate with borrow
					 */
					mcode = 0xde;
					byte2 = r1;

					break;

				case 'inr':
					// Read the register to increment.
					r1 = this.readWord(opcodeLine);

					/*
					 * INR r
					 * (r) <- (r) + 1
					 * Increment Register
					 */
					if (r1[0] == 'r') {
						ddd = this.regToBitcode(r1);
						mcode = (0x00 << 6) | (ddd << 3) | (0x04);
					}

					/*
					 * INR M
					 * ((H)(L)) <- ((H)(L)) + 1
					 * Increment Memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0x34;
					}

					else {
						console.log('[LOG] Error in INR, r1 = ' + r1);
					}

					break;

				case 'dcr':
					// Read the register to decrement.
					r1 = this.readWord(opcodeLine);

					/*
					 * DCR r
					 * (r) <- (r) + 1
					 * Decrement Register
					 */
					if (r1[0] == 'r') {
						ddd = this.regToBitcode(r1);
						mcode = (0x00 << 6) | (ddd << 3) | (0x05);
					}

					/*
					 * DCR M
					 * ((H)(L)) <- ((H)(L)) + 1
					 * Decrement Memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0x35;
					}

					else {
						console.log('[LOG] Error in DCR, r1 = ' + r1);
					}

					break;

				case 'inx':
					// Read the register pair to increment.
					r1 = this.readWord(opcodeLine);

					/*
					 * INX rp
					 * (rh)(rl) <- (rh)(rl) + 1
					 * Increment register pair
					 */
					rp = this.rpToBitcode(r1);
					mcode = (0x00 << 6) | (rp << 4) | (0x03);

					break;

				case 'dcx':
					// Read the register pair to decrement.
					r1 = this.readWord(opcodeLine);

					/*
					 * DCX rp
					 * (rh)(rl) <- (rh)(rl) - 1
					 * Decrement register pair.
					 */
					rp = this.rpToBitcode(r1);
					mcode = (0x00 << 6) | (rp << 4) | (0x0b);

					break;

				case 'dad':
					// Read the register pair.
					r1 = this.readWord(opcodeLine);

					/*
					 * DAD rp
					 * (H)(L) <- (H)(L) + (rh)(rl)
					 * Add register pair to H and L.
					 */
					rp = this.rpToBitcode(r1);
					mcode = (0x00 << 6) | (rp << 4) | (0x09);

					break;

				case 'daa':
					/*
					 * DAA
					 * Decimal Adjust Accumulator
					 */
					mcode = 0x27;

					break;

				/*
				 * Logical Group
				 * ANA, ANI, XRA, XRI, ORA, ORI, CMP, CPI, RLC, RRC, RAL, RAR, 
				 * CMA, CMC, STC
				 */
				case 'ana':
					// Read the register to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * ANA r
					 * (A) <- (A) ^ (r)
					 * AND Register
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x0a << 4) | (sss);
					}

					/*
					 * ANA M
					 * (A) <- (A) ^ ((H)(L))
					 * AND memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0xa6;
					}

					else {
						console.log('[LOG] Error in ANA, r1 = ' + r1);
					}

					break;

				case 'ani':
					// Read the data byte to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * ANI data
					 * (A) <- (A) ^ (byte 2)
					 * AND immediate
					 */
					mcode = 0xe6;
					byte2 = r1;

					break;

				case 'xra':
					// Read the register to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * XRA r
					 * (A) <- (A) XOR (r)
					 * Exclusive OR Register
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x0a << 4) | (0x01 << 3) | (sss);
					}

					/*
					 * XRA M
					 * (A) <- (A) XOR ((H)(L))
					 * Exclusive OR Memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0xae;
					}

					else {
						console.log('[LOG] Error in XRA, r1 = ' + r1);
					}

					break;

				case 'xri':
					// Read the data byte to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * XRI data
					 * (A) <- (A) XOR (byte 2)
					 * Exclusive OR immediate
					 */
					mcode = 0xee;
					byte2 = r1;

					break;

				case 'ora':
					// Read the register to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * ORA r
					 * (A) <- (A) v (r)
					 * OR Register
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x0b << 4) | (sss);
					}

					/*
					 * ORA M
					 * (A) <- (A) v ((H)(L))
					 * OR Memory
					 */
					else if (r1[0] == 'M') {
						mcode = 0xb6;
					}

					else {
						console.log('[LOG] Error in ORA, r1 = ' + r1);
					}

					break;

				case 'ori':
					// Read the data byte to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * ORI data
					 * (A) <- (A) v (byte 2)
					 * OR immediate
					 */
					mcode = 0xf6;
					byte2 = r1;

					break;

				case 'cmp':
					// Read the register to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * CMP r
					 * (A) - (r)
					 * Compare Register
					 * Note: The Z flag is set to 1 if (A) = (r).
					 * The CY flag is set to 1 if (A) < (r).
					 */
					if (r1[0] == 'r') {
						sss = this.regToBitcode(r1);
						mcode = (0x0b << 4) | (0x01 << 3) | (sss);
					}

					/*
					 * CMP M
					 * (A) - ((H)(L))
					 * Compare Memory
					 * Note: The Z flag is set to 1 if (A) = ((H)(L)).
					 * The CY flag is set to 1 if (A) < ((H)(L)).
					 */
					else if (r1[0] == 'M') {
						mcode = 0xbe;
					}

					else {
						console.log('[LOG] Error in CMP, r1 = ' + r1);
					}
					break;

				case 'cpi':
					// Read the data byte to be processed.
					r1 = this.readWord(opcodeLine);

					/*
					 * CPI data
					 * (A) - (byte 2)
					 * Compare immediate.
					 * Note: The Z flag is set to 1 if (A) = (byte 2).
					 * The CY flag is set to 1 if (A) < (byte 2).
					 */
					mcode = 0xfe;
					byte2 = r1;

					break;

				case 'rlc':
					/*
					 * RLC
					 * (A[n+1] <- (An); (A0) <- (A7)
					 * (CY) <- (A7)
					 * Rotate left
					 */
					mcode = 0x07;
					break;

				case 'rrc':
					/*
					 * RRC
					 * (An) <- (A[n+1]); (A7) <- (A0)
					 * (CY) <- (A0)
					 * Rotate right
					 */
					mcode = 0x0f;
					break;

				case 'ral':
					/*
					 * RAL
					 * (A[n+1]) <- (An); (CY) <- (A7)
					 * (A0) <- (CY)
					 * Rotate left through carry
					 */
					mcode = 0x17;
					break;

				case 'rar':
					/*
					 * RAR
					 * (An) <- (An + 1); (CY) <- (A0)
					 * (A7) <- (CY)
					 * Rotate right through carry
					 */
					mcode = 0x1f;
					break;

				case 'cma':
					/*
					 * CMA
					 * (A) <- !(A)
					 * Complement accumulator
					 */
					mcode = 0x2f;
					break;

				case 'cmc':
					/*
					 * CMC
					 * (CY) <- !(CY)
					 * Complement carry
					 */
					mcode = 0x3f;
					break;

				case 'stc':
					/*
					 * STC
					 * (CY) <- 1
					 * Set carry
					 */
					mcode = 0x37;
					break;

				/*
				 * Branch Group
				 * JMP, Jcondition, CALL, Ccondition, RET, Rcondition, RST, PCHL
				 * Conditions can be one of the following:
				 * NZ - not zero (Z = 0)
				 * Z - zero (Z = 1)
				 * NC - no carry (CY = 0)
				 * C - carry (CY = 1)
				 * PO - parity odd (P = 0)
				 * PE - parity even (P = 1)
				 * P - plus (S = 0)
				 * M - minus (S = 1)
				 */
				case 'jmp':
					// Read the address bytes.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * JMP addr
					 * (PC) <- (byte 3) (byte 2)
					 * Jump
					 */
					mcode = 0xc3;
					byte2 = r1;
					byte3 = r2;

					break;

				/*
				 * Jcondition - JNZ, JZ, JNC, JC, JPO, JPE, JP, JM
				 * If (CCC)
				 * (PC) <- (byte 3) (byte 2)
				 * Conditional jump
				 */
				case 'jnz':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('nz');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jz':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('z');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jnc':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('nc');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jc':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('c');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jpo':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('po');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jpe':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('pe');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jp':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('p');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'jm':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('m');
					mcode = (0x03 << 6) | (ccc << 3) | (0x02);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'call':
					// Read the address bytes.
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);

					/*
					 * CALL addr
					 * ((SP) - 1) <- (PCH)
					 * ((SP) - 2) <- (PCL)
					 * (SP) <- (SP) - 2
					 * (PC) <- (byte 3) (byte 2)
					 * Call
					 */
					mcode = 0xcd;
					byte2 = r1;
					byte3 = r2;

					break;

				/*
				 * Ccondition - CNZ, CZ, CNC, CC, CPO, CPE, CP, CM
				 * If (CCC)
				 * ((SP) - 1) <- (PCH)
				 * ((SP) - 2) <- (PCL)
				 * (SP) <- (SP) - 2
				 * (PC) <- (byte 3) (byte 2)
				 * Conditional call
				 */
				case 'cnz':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('nz');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cz':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('z');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cnc':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('nc');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cc':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('c');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cpo':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('po');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cpe':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('pe');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cp':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('p');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'cm':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('m');
					mcode = (0x03 << 6) | (ccc << 3) | (0x04);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'ret':
					/*
					 * RET
					 * (PCL) <- ((SP));
					 * (PCH) <- ((SP) + 1);
					 * (SP) <- (SP) + 2;
					 * Return
					 */
					mcode = 0xc9;
					break;

				/*
				 * Rcondition - RNZ, RZ, RNC, RC, RPO, RPE, RP, RM
				 * If (CCC)
				 * (PCL) <- ((SP))
				 * (PCH) <- ((SP) + 1)
				 * (SP) <- (SP) + 2
				 * Conditional return
				 */
				case 'rnz':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('nz');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rz':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('z');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rnc':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('nc');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rc':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('c');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rpo':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('po');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rpe':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('pe');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rp':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('p');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rm':
					r1 = this.readWord(opcodeLine);
					r2 = this.readWord(opcodeLine);
					ccc = this.condToBitcode('m');
					mcode = (0x03 << 6) | (ccc << 3) | (0x00);
					byte2 = r1;
					byte3 = r2;
					break;

				case 'rst':
					// Read the 3-bit number provided as the argument.
					r1 = this.readWord(opcodeLine);

					/*
					 * RST n
					 * ((SP) - 1) <- (PCH)
					 * ((SP) - 2) <- (PCL)
					 * (SP) <- (SP) - 2
					 * (PC) <- 8 * (NNN)
					 * Restart
					 */
					var nnn = r1 & 0x07;
					mcode = (0x03 << 6) | (nnn << 3) | (0x07);

					break;

				case 'pchl':
					/*
					 * PCHL
					 * (PCH) <- (H)
					 * (PCL) <- (L)
					 * Jump H and L indirect - move H and L to PC
					 */
					mcode = 0xe9;
					break;

				/*
				 * Stack, I/O and Machine Control Group
				 * PUSH, POP, XTHL, SPHL, IN, OUT, EI, DI, HLT, NOP, RIM, SIM
				 */

				case 'push':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);

					/*
					 * PUSH rp
					 * ((SP) - 1) <- (rh)
					 * ((SP) - 2) <- (rl)
					 * (SP) <- (SP) - 2
					 * Push
					 * Note: rp = SP may not be specified.
					 */
					if (r1 == 'SP') {
						console.log('[LOG] Error in Push instruction, rp = ' + r1);
					}

					else if ((r1 == 'BC') || (r1 == 'DE') || (r1 == 'HL')) {
						rp = this.rpToBitcode(r1);
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
					else if (r1 == 'PSW') {
						// Case where the rp == SP (bitcode 11).
						//mcode = (0x03 << 6) | (0x03 << 4) | (0x05);
						mcode = 0xf5;
					}

					break;

				case 'pop':
					// Read the arguments for the opcode.
					r1 = this.readWord(opcodeLine);

					/*
					 * POP rp
					 * (rl) <- ((SP))
					 * (rh) <- ((SP) + 1)
					 * (SP) <- ((SP) + 2)
					 * Pop
					 * Note: rp = SP may not be specified.
					 */
					if (r1 == 'SP') {
						console.log('[LOG] Error in Pop instruction, rp = ' + r1);
					}

					else if ((r1 == 'BC') || (r1 == 'DE') || (r1 == 'HL')) {
						rp = this.rpToBitcode(r1);
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
					else if (r1 == 'PSW') {
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
					r1 = this.readWord(opcodeLine);

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
					r1 = this.readWord(opcodeLine);

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
}

module.exports = {
	Assembler8085
};
