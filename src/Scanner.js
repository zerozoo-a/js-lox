import { Main } from "./main.js";
import { Token } from "./model/Token.js";
import { TokenType as Type } from "./model/TokenType.js";

export class Scanner {
  /** @type {string} */ source;
  /** @type {Token[]} */ #tokens = [];
  /** @type {number} */ #start = 0;
  /** @type {number} */ #current = 0;
  /** @type {number} */ #line = 1;
  /** @type {Main} */ #main;

  /**
   * @param {string} source
   * @param {Main} main
   */
  constructor(source, main) {
    this.source = source;
    this.#main = main;
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

      case "!": // !=
        this.#addToken(this.#match("=") ? Type.BANG_EQUAL : Type.Bang);
        break;
      case "=": // ==
        this.#addToken(this.#match("=") ? Type.EQUAL_EQUAL : Type.EQUAL);
        break;
      case "<": // <=
        this.#addToken(this.#match("=") ? Type.LESS_EQUAL : Type.LESS);
        break;
      case ">": // >=
        this.#addToken(this.#match("=") ? Type.GREATER_EQUAL : Type.GREATER);
        break;
      case "/":
        if (this.#match("/")) {
          while (this.#peek() != "\n" && !this.#isAtEnd()) this.#advance();
        } else {
          this.#addToken(Type.SLASH);
        }
        break;

      case "":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.#line++;
        break;
      case '"':
        this.#string();
        break;

      default:
        if (this.#isDigit(c)) {
          this.#number();
        }

        this.#main.error(this.#line, "Unexpected character.");
        break;
    }
  }

  #number() {
    while (this.#isDigit(this.#peek())) {
      this.#advance();
    }

    if (this.#peek() == "." && this.#isDigit(this.#peekNext())) {
      this.#advance();
      while (this.#isDigit(this.#peek())) {
        this.#advance();
      }
    }
  }

  #peek() {
    if (this.#isAtEnd()) return "\0";
    return this.source.charAt(this.#current);
  }

  #peekNext() {
    if (this.#current + 1 >= this.source.length()) return "\0";
    return this.source.charAt(this.#current + 1);
  }

  #isAlpha(/** @type {string} */ c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  #isAlphaNumeric(c) {
    return this.#isAlpha(c) || this.#isDigit(c);
  }

  #identifier() {
    while (isAlphaNumeric(this.#peek())) {
      this.#advance();
    }
    // this.#addToken(Type.IDENTIFIER);
    const text = this.source.substring(this.#start, this.#current);
    const type = Type[text.toUpperCase()];

    if (!type) type = Type.IDENTIFIER;
    this.#addToken(type);
  }

  #isDigit(c /** @type {string} */) {
    return c >= "0" && c <= "9";
  }

  #string() {
    while (this.#peek() != '"' && !this.#isAtEnd()) {
      if (this.#peek() === "\n") this.#line++;
      this.#advance();
    }

    if (this.#isAtEnd()) {
      this.#main.error(this.#line, "Unterminated string.");
      return;
    }

    this.#advance();

    this.#addToken(
      Type.STRING,
      this.source.substring(this.#start + 1, this.#current - 1)
    );
  }

  #advance() {
    return this.source.charAt(this.#current++);
  }

  /**
   * @param {string} expected
   * @returns {boolean}
   */
  #match(expected) {
    if (this.#isAtEnd()) return false;
    if (this.source.charAt(this.#current) != expected) return false;
    this.#current++;
    return true;
  }

  #addToken(/** @type {number} */ type, literal = null) {
    const text = this.source.substring(this.#start, this.#current);
    this.#tokens.push(new Token(type, text, literal, this.#line));
  }
}
