import { ParseError } from "../core/errors.js";
import type { Instruction } from "../core/instructions.js";
import { COMMANDS, NUMBER_ALIASES, normalizeCommand, type CommandDefinition } from "./commands.js";

type LoopFrame = {
  instruction: Extract<Instruction, { type: "LOOP" }>;
  body: Instruction[];
};

export class Parser {
  parse(source: string): Instruction[] {
    const root: Instruction[] = [];
    const stack: LoopFrame[] = [];
    const lines = source.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const lineNumber = index + 1;
      const raw = this.stripComment(lines[index]).trim();

      if (raw === "") {
        continue;
      }

      const definition = this.resolveCommand(raw);
      if (!definition) {
        throw new ParseError(`Unknown command "${raw}"`, lineNumber);
      }

      const target = stack.length === 0 ? root : stack[stack.length - 1].body;

      if (definition.instruction === "LOOP_START") {
        const loop: Extract<Instruction, { type: "LOOP" }> = {
          type: "LOOP",
          body: [],
          line: lineNumber,
          source: raw
        };
        target.push(loop);
        stack.push({ instruction: loop, body: loop.body });
        continue;
      }

      if (definition.instruction === "LOOP_END") {
        if (stack.length === 0) {
          throw new ParseError(`Unexpected loop end "${raw}"`, lineNumber);
        }
        stack.pop();
        continue;
      }

      target.push(this.toInstruction(definition, lineNumber, raw));
    }

    const unclosed = stack.at(-1);
    if (unclosed) {
      throw new ParseError("Unclosed loop", unclosed.instruction.line);
    }

    return root;
  }

  private stripComment(line: string): string {
    const hashIndex = line.indexOf("#");
    const slashIndex = line.indexOf("//");
    const indexes = [hashIndex, slashIndex].filter((index) => index >= 0);

    if (indexes.length === 0) {
      return line;
    }

    return line.slice(0, Math.min(...indexes));
  }

  private resolveCommand(raw: string): CommandDefinition | undefined {
    if (/^\d+$/.test(raw)) {
      return NUMBER_ALIASES.get(raw);
    }

    return COMMANDS[normalizeCommand(raw)];
  }

  private toInstruction(definition: CommandDefinition, line: number, source: string): Instruction {
    switch (definition.instruction) {
      case "INC":
        return { type: "INC", amount: definition.amount ?? 1, line, source };
      case "DEC":
        return { type: "DEC", amount: definition.amount ?? 1, line, source };
      case "MOVE_RIGHT":
        return { type: "MOVE_RIGHT", amount: definition.amount ?? 1, line, source };
      case "MOVE_LEFT":
        return { type: "MOVE_LEFT", amount: definition.amount ?? 1, line, source };
      case "PRINT":
        return { type: "PRINT", line, source };
      case "INPUT":
        return { type: "INPUT", line, source };
      case "EXIT":
        return { type: "EXIT", line, source };
      default:
        throw new ParseError(`Invalid command "${source}"`, line);
    }
  }
}

export function parse(source: string): Instruction[] {
  return new Parser().parse(source);
}
