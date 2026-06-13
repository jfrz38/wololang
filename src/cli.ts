#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import { explain, parse, run, transpileToBrainfuck } from "./index.js";

type CliOptions = {
  target?: string;
  out?: string;
  input?: string;
  ignoreExtensions?: boolean;
};

const VERSION = "0.1.0";

async function main(argv: string[]): Promise<number> {
  const [command, file, ...rest] = argv;

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return 0;
  }

  if (command === "--version" || command === "-v") {
    console.log(VERSION);
    return 0;
  }

  if (!file) {
    throw new Error(`Missing file. Try: wololo ${command} hello.wolo`);
  }

  assertWololangFile(file);

  const options = parseOptions(rest);
  const source = await readFile(file, "utf8");
  const instructions = parse(source);

  switch (command) {
    case "run": {
      const result = run(instructions, { input: options.input });
      process.stdout.write(result.output);
      return 0;
    }
    case "debug": {
      const result = run(instructions, { input: options.input, debug: true });
      process.stdout.write(result.output);
      if (result.output && !result.output.endsWith("\n")) {
        process.stdout.write("\n");
      }
      for (const event of result.debugEvents) {
        console.error(
          `line=${event.line} instruction=${event.instruction} pointer=${event.pointer} cell=${event.cell} memory=${JSON.stringify(event.memory)}`
        );
      }
      return 0;
    }
    case "build": {
      if (options.target !== "brainfuck") {
        throw new Error("Only --target brainfuck is supported");
      }

      const output = transpileToBrainfuck(instructions, { ignoreExtensions: options.ignoreExtensions });

      if (options.out) {
        await writeFile(options.out, output, "utf8");
      } else {
        console.log(output);
      }

      return 0;
    }
    case "explain":
      console.log(explain(instructions));
      return 0;
    default:
      throw new Error(`Unknown command "${command}"`);
  }
}

function parseOptions(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    switch (arg) {
      case "--target":
        options.target = requireValue(args, index, arg);
        index += 1;
        break;
      case "--out":
        options.out = requireValue(args, index, arg);
        index += 1;
        break;
      case "--input":
        options.input = requireValue(args, index, arg);
        index += 1;
        break;
      case "--ignore-extensions":
        options.ignoreExtensions = true;
        break;
      default:
        throw new Error(`Unknown option "${arg}"`);
    }
  }

  return options;
}

function requireValue(args: string[], index: number, option: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }
  return value;
}

function assertWololangFile(file: string): void {
  const extension = extname(file);
  if (extension !== ".wolo" && extension !== ".wololo") {
    throw new Error(`Expected a .wolo or .wololo file, got "${file}"`);
  }
}

function printHelp(): void {
  console.log(`wololo ${VERSION}

Usage:
  wololo run <file.wolo> [--input text]
  wololo debug <file.wolo> [--input text]
  wololo explain <file.wolo>
  wololo build <file.wolo> --target brainfuck [--out file.bf] [--ignore-extensions]

Commands:
  run       Execute Wololang source
  debug     Execute and print VM trace to stderr
  explain   Show parsed instructions
  build     Transpile Wololang source
`);
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`wololo: ${message}`);
  process.exitCode = 1;
});
