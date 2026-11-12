# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-08-19

### Changed

- Bumped package version to `0.1.1`.
- Updated CI dependencies (GitHub Actions) via Dependabot.
- Updated npm dependencies (`@types/node`, `tsx`, `typescript`, `vitest`) via Dependabot.

## [0.1.0] - 2026-06-13

### Added

- **Wololang parser**: full support for canonical taunt names and numeric taunt numbers, with comment and empty-line handling.
- **Wololang runtime (VM)**: Brainfuck-like virtual machine with tape of 0–255 cells, pointer movement, byte wraparound, and loop support.
- **`the_wonder_no` VM extension**: program-halt command (Wololang-only, not Brainfuck-compatible).
- **CLI** (`wololo`): commands for `run`, `debug`, `explain`, and `build --target brainfuck`.
- **Brainfuck transpiler**: transpile Wololang source to Brainfuck code; VM-only extensions fail by default with an `--ignore-extensions` escape hatch.
- **Test suite**: unit tests covering the parser, VM, and Brainfuck transpiler.
- **CI workflows**: build, release, and dependency update (Dependabot) GitHub Actions workflows.

### Documentation

- README with local usage instructions, quick start, CLI reference, syntax table, and Brainfuck compatibility notes.
- Example files: `hello.wolo`, `hello-aoe.wolo`, and a taunt-text example.
- Improved examples and README content.

### Changed

- Upgraded TypeScript version after initial setup.

[Unreleased]: https://github.com/jfrz38/wololang/compare/0.1.1...HEAD
[0.1.1]: https://github.com/jfrz38/wololang/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/jfrz38/wololang/releases/tag/0.1.0
