import type { InstructionType } from "../core/instructions.js";

export type CommandDefinition = {
  instruction: Exclude<InstructionType, "LOOP"> | "LOOP_START" | "LOOP_END";
  amount?: number;
  taunt: string;
  number?: number;
  brainfuck?: string;
};

export const COMMANDS: Record<string, CommandDefinition> = {
  yes: {
    instruction: "INC",
    amount: 1,
    taunt: "Yes.",
    number: 1,
    brainfuck: "+"
  },
  no: {
    instruction: "DEC",
    amount: 1,
    taunt: "No.",
    number: 2,
    brainfuck: "-"
  },
  dont_resign: {
    instruction: "MOVE_RIGHT",
    amount: 1,
    taunt: "Don't resign!",
    number: 104,
    brainfuck: ">"
  },
  you_can_resign_again: {
    instruction: "MOVE_LEFT",
    amount: 1,
    taunt: "You can resign again.",
    number: 105,
    brainfuck: "<"
  },
  wololo: {
    instruction: "PRINT",
    taunt: "Wololo",
    number: 30,
    brainfuck: "."
  },
  monk_i_need_a_monk: {
    instruction: "INPUT",
    taunt: "Monk! I need a monk!",
    number: 18,
    brainfuck: ","
  },
  ahh: {
    instruction: "LOOP_START",
    taunt: "Ahh!",
    number: 7,
    brainfuck: "["
  },
  ooh: {
    instruction: "LOOP_END",
    taunt: "Ooh!",
    number: 9,
    brainfuck: "]"
  },
  the_wonder_no: {
    instruction: "EXIT",
    taunt: "The wonder, the wonder, the... no!",
    number: 26
  }
};

export const NUMBER_ALIASES = new Map<string, CommandDefinition>(
  Object.values(COMMANDS)
    .filter((command) => command.number !== undefined)
    .map((command) => [String(command.number), command])
);

export function normalizeCommand(line: string): string {
  return line.trim().toLowerCase().replace(/\s+/g, "_");
}
