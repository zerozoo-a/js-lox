import { Main } from "./main.js";
import { Token } from "./model/Token.js";
import { TokenType as Type } from "./model/TokenType.js";

export class Scanner {
  /** @type {string} */ source;
  /** @type {Token[]} */ #tokens = [];
  /** @type {number} */ #start = 0;
  /** @type {number} */ #current = 0;
  /** @type {number} */ #line = 1;
  // /** @type {Main} */ #main = 1;

  /**
   * @param {string} source
   * @param {Main} main
   */
  constructor(source, main) {
    this.source = source;
    // this.#main = main;
  }

  scanTokens() {
    while (this.#isAtEnd()) {
      start = current;
      this.#scanToken();
    }

    this.#tokens.push(new Token(Type.EOF, "", null, this.#line));
    return this.#tokens;
  }

  #isAtEnd() {
    return this.#current >= this.source.length;
  }

  #scanToken() {
    const c = this.#advance();

    switch (c) {
      case "(":
        this.#addToken(Type.LEFT_PAREN);
        break;
      case ")":
        this.#addToken(Type.RIGHT_PAREN);
        break;
      case "{":
        this.#addToken(Type.LEFT_BRACE);
        break;
      case "}":
        this.#addToken(Type.RIGHT_BRACE);
        break;
      case ",":
        this.#addToken(Type.COMMA);
        break;
      case ".":
        this.#addToken(Type.DOT);
        break;
      case "-":
        this.#addToken(Type.MINUS);
        break;
      case "+":
        this.#addToken(Type.PLUS);
        break;
      case ";":
        this.#addToken(Type.SEMICOLON);
        break;
      case "*":
        this.#addToken(Type.STAR);
        break;
      default:
        // this.#main.error(this.#line, "Unexpected character.");
        break;
    }
  }

  #advance() {
    return this.source.charAt(this.#current++);
  }

  #addToken(/** @type {number} */ type, literal = null) {
    const text = this.source.substring(this.#start, this.#current);
    this.#tokens.push(new Token(type, text, literal, this.#line));
  }
}
