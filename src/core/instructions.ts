export type Instruction =
  | { type: "INC"; amount: number; line: number; source: string }
  | { type: "DEC"; amount: number; line: number; source: string }
  | { type: "MOVE_RIGHT"; amount: number; line: number; source: string }
  | { type: "MOVE_LEFT"; amount: number; line: number; source: string }
  | { type: "PRINT"; line: number; source: string }
  | { type: "INPUT"; line: number; source: string }
  | { type: "LOOP"; body: Instruction[]; line: number; source: string }
  | { type: "EXIT"; line: number; source: string };

export type InstructionType = Instruction["type"];
