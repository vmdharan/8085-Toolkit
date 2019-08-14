// Print out test line.
console.log('8085 instructions');

var fs = require('fs');
var asm = require('./assembler.js');

// Execute
asm8085();

/*
 * Main entry point for testing the 8085 assembler.
 */
function asm8085() {
	this.srcFile = '../data/data_transfer_test.dat';
	//this.srcFile = '../data/stack_io_test.dat';
	//this.srcFile = '../data/arithmetic_test.dat';
	//this.srcFile = '../data/logical_test.dat';
	//this.srcFile = '../data/branch_test.dat';
	this.data = fs.readFileSync(this.srcFile, 'utf8');
    
    var assembler = new asm.Assembler8085();
	assembler.readData(this.data);
}