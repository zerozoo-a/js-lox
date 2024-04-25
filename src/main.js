// @ts-check
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";

class Main {
  /**
   * @param {string[]} args
   */
  main(args) {
    if (args.length > 1) {
      console.log(" >>> Usage: jsLox: ");
      this.#exitProcess();
    } else if (args.length === 1) {
      this.#runFile(args[0]);
    } else {
      this.#runPrompt();
    }
  }

  #runPrompt() {}

  /**
   *
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

  #exitProcess() {
    process.exit(0);
  }

  /**
   *
   * @param {NodeJS.Process} process
   */
  listenOnSIGINT(process) {
    process.on("SIGNINT", () => {
      console.log("lox program will terminate...");
      this.#exitProcess();
    });
  }
  /**
   *
   * @param {NodeJS.Process} process
   */

  listenOnSIGTERM(process) {
    process.on("SIGTERM", () => {
      console.log("process killed lox program");
      this.#exitProcess();
    });
  }
}

const main = new Main();
main.main(process.argv.slice(2));
