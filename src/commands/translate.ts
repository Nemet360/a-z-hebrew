import { Arguments, CommandBuilder } from "yargs";
import { TranslateService } from "../services/translate-service";
import { Logger } from "../services/logging";

type Options = {
  text: string;
  debug: boolean | undefined;
};

const wordsOrder: string[] = [
  "A",
  "B",
  "G",
  "D",
  "H",
  "V",
  "Z",
  "J",
  "T",
  "Y",
  "K",
  "L",
  "M",
  "N",
  "S",
  "I",
  "P",
  "X",
  "Q",
  "R",
  "W",
  "U",
  "C",
  "E",
  "F",
  "O",
];

export const command = "translate <text>";
export const desc = "translate <text> from english words to hebrew ones";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      debug: { type: "boolean" },
    })
    .positional("text", { type: "string", demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
  const { text, debug } = argv;

  let isDebugEnabled = false;
  if (debug) isDebugEnabled = true;

  const logger = new Logger(isDebugEnabled);
  logger.WriteLog(`received input : ${text}`);

  const service = new TranslateService(wordsOrder, logger);
  const wordsOrdered = service.translate(text);

  logger.WriteLog(
    `*******************************************************`,
    false
  );

  for (const word of wordsOrdered) {
    process.stdout.write(`${word} `);
  }
  logger.WriteLog(``);
  logger.WriteLog(
    `*******************************************************`,
    false
  );

  process.exit(0);
};
