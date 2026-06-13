import { describe, expect, it } from "vitest";
import { parse, run } from "../src/index.js";

describe("run", () => {
  it("prints ASCII output", () => {
    const source = `${"1\n".repeat(65)}30`;
    expect(run(parse(source)).output).toBe("A");
  });

  it("executes loops", () => {
    const source = `
1
1
1
7
104
1
105
2
9
104
30
`;
    expect(run(parse(source)).output).toBe(String.fromCharCode(3));
  });

  it("stops on the_wonder_no", () => {
    const source = "1\n26\n1\n30";
    expect(run(parse(source))).toMatchObject({ output: "", exited: true });
  });

  it("reads input", () => {
    expect(run(parse("18\n30"), { input: "Z" }).output).toBe("Z");
  });
});
