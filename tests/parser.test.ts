import { describe, expect, it } from "vitest";
import { parse } from "../src/parser/parse.js";

describe("parse", () => {
  it("parses text taunts", () => {
    expect(parse("yes\nno\nwololo").map((instruction) => instruction.type)).toEqual(["INC", "DEC", "PRINT"]);
  });

  it("parses numeric taunts", () => {
    expect(parse("1\n2\n30\n26").map((instruction) => instruction.type)).toEqual(["INC", "DEC", "PRINT", "EXIT"]);
  });

  it("parses nested loop bodies", () => {
    const instructions = parse("1\n7\n2\n9");
    expect(instructions[1]).toMatchObject({ type: "LOOP", body: [{ type: "DEC" }] });
  });

  it("rejects unknown commands", () => {
    expect(() => parse("wood_please")).toThrow('Line 1: Unknown command "wood_please"');
  });

  it("rejects unclosed loops", () => {
    expect(() => parse("7\n1")).toThrow("Line 1: Unclosed loop");
  });
});
