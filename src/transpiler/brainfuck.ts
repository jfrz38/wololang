import { TranspileError } from "../core/errors.js";
import type { Instruction } from "../core/instructions.js";

export type BrainfuckOptions = {
  ignoreExtensions?: boolean;
};

export class BrainfuckTranspiler {
  constructor(private readonly options: BrainfuckOptions = {}) {}

  transpile(instructions: Instruction[]): string {
    return instructions.map((instruction) => this.transpileInstruction(instruction)).join("");
  }

  private transpileInstruction(instruction: Instruction): string {
    switch (instruction.type) {
      case "INC":
        return "+".repeat(instruction.amount);
      case "DEC":
        return "-".repeat(instruction.amount);
      case "MOVE_RIGHT":
        return ">".repeat(instruction.amount);
      case "MOVE_LEFT":
        return "<".repeat(instruction.amount);
      case "PRINT":
        return ".";
      case "INPUT":
        return ",";
      case "LOOP":
        return `[${this.transpile(instruction.body)}]`;
      case "EXIT":
        if (this.options.ignoreExtensions) {
          return "";
        }
        throw new TranspileError("the_wonder_no is a Wololang VM extension and cannot be represented in Brainfuck", instruction.line);
    }
  }
}

export function transpileToBrainfuck(instructions: Instruction[], options: BrainfuckOptions = {}): string {
  return new BrainfuckTranspiler(options).transpile(instructions);
}
