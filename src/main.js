// @ts-check

import { createReadStream } from "node:fs";
import { Scanner } from "./Scanner.js";
// import { readFile } from "node:fs/promises";
import ReadLine from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export class Main {
  /** @type { ReadLine.Interface | undefined } */
  #rl;

  /** @type { boolean } */
  #hadError = false;
  // /** @type { Scanner } */
  scanner;

  /** @param {string[]} args */
  main(args) {
    this.#addListeners();

    if (args.length > 1) {
      console.log(" >>> Usage: jsLox: ");
      this.#exitProcess();
    } else if (args.length === 1) {
      this.#runFile(args[0]);
    } else {
      this.#runPrompt();
    }
  }

  /**
   * @returns ReadLine.Interface
   */
  #initReadLine() {
    if (this.#rl) {
      return this.#rl;
    }
    this.#rl = ReadLine.createInterface({
      input,
      output,
    });

    return this.#rl;
  }

  /**
   * @param {string} source
   */
  #run(source) {
    this.scanner = new Scanner(source, this);
    const tokens = this.scanner.scanTokens();
    tokens.forEach((token) => console.log("token: ", token));
  }

  /**
   *
   * @param {number} line
   * @param {string} message
   */
  error(line, message) {
    console.error(`line ${line}: ${message}`);
    this.#hadError = true;
  }

  async #runPrompt() {
    const rl = this.#initReadLine();
    while (1) {
      const line = await rl.question("> ");
      if (!line) this.#exitProcess();
      console.log("🚀 ~ Main ~ #runPrompt ~ line:", line);
      this.#run(line);
      this.#hadError = false;
    }
  }

  /**
   * @param {string} path
   */
  #runFile(path) {
    const stream = createReadStream(path, {
      encoding: "utf8",
      highWaterMark: 1024 * 1024,
    });

    stream.on("data", function (chunk) {
      console.log("🚀 ~ Main ~ chunk:", chunk);
      console.log("Processing chunk of size:", chunk.length);
    });

    stream.on("end", function () {
      console.log("Done processing file.");
    });

    stream.on("error", function (err) {
      console.error("Error:", err);
    });
  }

  /** @returns {void} */
  #exitProcess() {
    process.exit(0);
  }

  #addListeners() {
    this.#listenOnSIGINT(process);
    this.#listenOnSIGTERM(process);
  }

  /**
   * @param {NodeJS.Process} process
   * @returns {void}
   */
  #listenOnSIGINT(process) {
    process.on("SIGNINT", () => {
      console.log("lox program will terminate...");
      this.#exitProcess();
    });
  }

  /**
   * @param {NodeJS.Process} process
   * @returns {void}
   */
  #listenOnSIGTERM(process) {
    process.on("SIGTERM", () => {
      console.log("process killed lox program");
      this.#exitProcess();
    });
  }
}

const main = new Main();
main.main(process.argv.slice(2));
