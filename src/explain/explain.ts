import type { Instruction } from "../core/instructions.js";

const INSTRUCTION_NAMES: Record<Instruction["type"], string> = {
  INC: "INC",
  DEC: "DEC",
  MOVE_RIGHT: "MOVE_RIGHT",
  MOVE_LEFT: "MOVE_LEFT",
  PRINT: "PRINT",
  INPUT: "INPUT",
  LOOP: "LOOP",
  EXIT: "EXIT"
};

export class Explainer {
  explain(instructions: Instruction[]): string {
    return this.explainBlock(instructions, 0).join("\n");
  }

  private explainBlock(instructions: Instruction[], depth: number): string[] {
    const indent = "  ".repeat(depth);
    const lines: string[] = [];

    for (const instruction of instructions) {
      lines.push(`${indent}${instruction.line}: ${instruction.source} -> ${this.describe(instruction)}`);

      if (instruction.type === "LOOP") {
        lines.push(...this.explainBlock(instruction.body, depth + 1));
      }
    }

    return lines;
  }

  private describe(instruction: Instruction): string {
    const name = INSTRUCTION_NAMES[instruction.type];
    return "amount" in instruction ? `${name} ${instruction.amount}` : name;
  }
}

export function explain(instructions: Instruction[]): string {
  return new Explainer().explain(instructions);
}
