import { describe, expect, it } from "vitest";
import { parse, transpileToBrainfuck } from "../src/index.js";

describe("transpileToBrainfuck", () => {
  it("transpiles Brainfuck-compatible instructions", () => {
    expect(transpileToBrainfuck(parse("1\n1\n104\n2\n105\n30\n18\n7\n2\n9"))).toBe("++>-<.,[-]");
  });

  it("rejects VM extensions by default", () => {
    expect(() => transpileToBrainfuck(parse("26"))).toThrow("cannot be represented in Brainfuck");
  });

  it("can ignore VM extensions", () => {
    expect(transpileToBrainfuck(parse("1\n26\n30"), { ignoreExtensions: true })).toBe("+.");
  });
});
