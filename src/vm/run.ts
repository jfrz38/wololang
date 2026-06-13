import { RuntimeError } from "../core/errors.js";
import type { Instruction } from "../core/instructions.js";

export type RunOptions = {
  input?: string;
  debug?: boolean;
  memorySize?: number;
};

export type DebugEvent = {
  line: number;
  instruction: string;
  pointer: number;
  cell: number;
  memory: number[];
};

export type RunResult = {
  output: string;
  exited: boolean;
  pointer: number;
  memory: number[];
  debugEvents: DebugEvent[];
};

type State = {
  memory: number[];
  pointer: number;
  input: string;
  inputPointer: number;
  output: string;
  exited: boolean;
  debug: boolean;
  debugEvents: DebugEvent[];
};

type InstructionHandlers = {
  [Type in Instruction["type"]]: (instruction: Extract<Instruction, { type: Type }>) => void;
};

export class VirtualMachine {
  private state: State;

  private readonly handlers: InstructionHandlers = {
    INC: (instruction) => {
      this.state.memory[this.state.pointer] = this.wrapByte(this.state.memory[this.state.pointer] + instruction.amount);
    },
    DEC: (instruction) => {
      this.state.memory[this.state.pointer] = this.wrapByte(this.state.memory[this.state.pointer] - instruction.amount);
    },
    MOVE_RIGHT: (instruction) => {
      this.state.pointer += instruction.amount;
      this.ensureCell(instruction.line);
    },
    MOVE_LEFT: (instruction) => {
      this.state.pointer -= instruction.amount;
      this.ensureCell(instruction.line);
    },
    PRINT: () => {
      this.state.output += String.fromCharCode(this.state.memory[this.state.pointer]);
    },
    INPUT: () => {
      const char = this.state.input[this.state.inputPointer] ?? "\0";
      this.state.memory[this.state.pointer] = char.charCodeAt(0);
      this.state.inputPointer += 1;
    },
    LOOP: (instruction) => {
      while (this.state.memory[this.state.pointer] !== 0 && !this.state.exited) {
        this.executeBlock(instruction.body);
      }
    },
    EXIT: () => {
      this.state.exited = true;
    }
  };

  constructor(private readonly options: RunOptions = {}) {
    this.state = this.createInitialState();
  }

  run(instructions: Instruction[]): RunResult {
    this.state = this.createInitialState();
    this.executeBlock(instructions);

    return {
      output: this.state.output,
      exited: this.state.exited,
      pointer: this.state.pointer,
      memory: this.state.memory,
      debugEvents: this.state.debugEvents
    };
  }

  private createInitialState(): State {
    return {
      memory: Array.from({ length: this.options.memorySize ?? 30_000 }, () => 0),
      pointer: 0,
      input: this.options.input ?? "",
      inputPointer: 0,
      output: "",
      exited: false,
      debug: this.options.debug ?? false,
      debugEvents: []
    };
  }

  private executeBlock(instructions: Instruction[]): void {
    for (const instruction of instructions) {
      if (this.state.exited) {
        return;
      }

      this.execute(instruction);

      if (this.state.debug) {
        this.state.debugEvents.push({
          line: instruction.line,
          instruction: instruction.type,
          pointer: this.state.pointer,
          cell: this.state.memory[this.state.pointer],
          memory: this.state.memory.slice(0, Math.max(10, this.state.pointer + 3))
        });
      }
    }
  }

  private execute(instruction: Instruction): void {
    const handler = this.handlers[instruction.type] as (current: Instruction) => void;
    handler(instruction);
  }

  private wrapByte(value: number): number {
    return ((value % 256) + 256) % 256;
  }

  private ensureCell(line: number): void {
    if (this.state.pointer < 0) {
      throw new RuntimeError("Pointer moved before cell 0", line);
    }

    while (this.state.pointer >= this.state.memory.length) {
      this.state.memory.push(0);
    }
  }
}

export function run(instructions: Instruction[], options: RunOptions = {}): RunResult {
  return new VirtualMachine(options).run(instructions);
}
