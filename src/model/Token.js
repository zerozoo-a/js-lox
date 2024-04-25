// import { TokenType } from "./TokenType";
export class Token {
  type;
  lexeme = "";
  literal = {};
  line = 0;

  constructor(
    /** @type {number} */ type,
    /** @type {string} */ lexeme,
    /** @type {{[k:string]:any} | null} */ literal,
    /** @type {number} */ line
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}
