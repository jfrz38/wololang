# Wololang

[![Build](https://img.shields.io/github/actions/workflow/status/jfrz38/wololang/build.yml)](https://github.com/jfrz38/wololang/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jfrz38/wololang/blob/main/LICENSE)

![Wololo](https://static.wikia.nocookie.net/ageofempires/images/a/a1/Monk_sprite_aoe2de.png)

[Wololang](https://static.wikia.nocookie.net/ageofempires/images/a/a1/Wololo.ogg) is a joke interpreter/toolchain for an Age of Empires II taunt-based esolang, powered by a Brainfuck-like VM.

Yes, it can transpile to Brainfuck. No, you should not use it.

## Local Usage

Wololang is not published to npm. Use it from a local checkout.

```bash
pnpm install
pnpm build
pnpm add -g .
wololo run examples/hello-aoe.wolo # Output: Hello AoE! 14!
```

`pnpm add -g .` exposes the local CLI as `wololo` globally on your machine. Re-run `pnpm build` after changing the TypeScript sources.

During development, you can skip the global link and run the CLI through `tsx`:

```bash
pnpm install
pnpm dev run examples/hello.wolo # Output: gg
```

## Quick Start

Create `hello.wolo`:

```txt
1
1
1
30
26
```

Run it:

```bash
wololo run hello.wolo
```

Wololang source files use `.wolo`. The longer `.wololo` extension is also accepted.

## CLI

```bash
wololo run examples/hello.wolo
wololo debug examples/hello.wolo
wololo explain examples/hello.wolo
wololo build examples/hello.wolo --target brainfuck --ignore-extensions
```

`run` executes a file.

`debug` executes a file and prints VM trace data to stderr.

`explain` shows how each source line is parsed.

`build --target brainfuck` transpiles to Brainfuck. VM-only extensions such as `the_wonder_no` fail by default; pass `--ignore-extensions` to omit them.

## Syntax

One line is one command. Empty lines and comments are ignored.

```txt
# comment
// comment
yes
wololo
```

Commands can be written as canonical taunt names or as taunt numbers.

## Commands

| Number | Taunt | Command | Brainfuck | Action |
|---:|---|---|---|---|
| `1` | `Yes.` | `yes` | `+` | Increment current cell |
| `2` | `No.` | `no` | `-` | Decrement current cell |
| `104` | `Don't resign!` | `dont_resign` | `>` | Move pointer right |
| `105` | `You can resign again.` | `you_can_resign_again` | `<` | Move pointer left |
| `30` | `Wololo` | `wololo` | `.` | Print current cell as ASCII |
| `18` | `Monk! I need a monk!` | `monk_i_need_a_monk` | `,` | Read one input character |
| `7` | `Ahh!` | `ahh` | `[` | Loop start |
| `9` | `Ooh!` | `ooh` | `]` | Loop end |
| `26` | `The wonder, the wonder, the... no!` | `the_wonder_no` | | Exit program |

## Brainfuck Compatibility

The core VM uses Brainfuck-style memory:

```txt
array/tape of 0..255 cells
current pointer
byte wraparound
loops while current cell != 0
```

`the_wonder_no` is a Wololang VM extension and is not Brainfuck-compatible.

## Disclaimer

This is a joke esolang interpreter. It is not endorsed by Microsoft, Forgotten Empires, or any villager who urgently needs a monk.
