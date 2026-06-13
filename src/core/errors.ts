export class WololangError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WololangError";
  }
}

export class ParseError extends WololangError {
  constructor(message: string, readonly line?: number) {
    super(line === undefined ? message : `Line ${line}: ${message}`);
    this.name = "ParseError";
  }
}

export class RuntimeError extends WololangError {
  constructor(message: string, readonly line?: number) {
    super(line === undefined ? message : `Line ${line}: ${message}`);
    this.name = "RuntimeError";
  }
}

export class TranspileError extends WololangError {
  constructor(message: string, readonly line?: number) {
    super(line === undefined ? message : `Line ${line}: ${message}`);
    this.name = "TranspileError";
  }
}
