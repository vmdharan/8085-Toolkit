# 8085-Toolkit
Compiler and Assembler for Intel 8085

### Compiler

**Grammar**

- program -> block
- block -> decls stmts
- decls -> decls decl empty
- decl -> type id ;
- type -> type [num] | primitive
- stmts -> stmts stmt | empty
- stmt -> empty

- empty -> null
- primitive -> char | int | float | boolean



### Assembler instruction groups

**Data Transfer Group**

MOV, MVI, LXI, LDA, STA, LHLD, SHLD, LDAX, STAX, XCHG

**Arithmetic Group**

ADD, ADI, ADC, ACI, SUB, SUI, SBB, SBI, INR, DCR, INX, DCX, DAD, DAA

**Logical Group**

ANA, ANI, XRA, XRI, ORA, ORI, CMP, CPI, RLC, RRC, RAL, RAR, CMA, CMC, STC

**Branch Group**

JMP, Jcondition, CALL, Ccondition, RET, Rcondition, RST, PCHL

Conditions can be one of the following:
- NZ - not zero (Z = 0)
- Z - zero (Z = 1)
- NC - no carry (CY = 0)
- C - carry (CY = 1)
- PO - parity odd (P = 0)
- PE - parity even (P = 1)
- P - plus (S = 0)
- M - minus (S = 1)

**Stack, I/O and Machine Control Group**

PUSH, POP, XTHL, SPHL, IN, OUT, EI, DI, HLT, NOP, RIM, SIM
