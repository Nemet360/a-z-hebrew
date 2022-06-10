import { Arguments, CommandBuilder } from "yargs";

type Options = {
  text: string;
  debug: boolean | undefined;
};

type MapKvpScore = { [key: string]: string | number };

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

let isDebugEnabled = false;
const writeLog = (message: string, isDebug?: boolean | undefined) => {
  let shouldWrite = true;
  if (isDebug && !isDebugEnabled) {
    shouldWrite = false;
  }
  if (shouldWrite) console.log(message);
};

export const handler = (argv: Arguments<Options>): void => {
  const { text, debug } = argv;
  if (debug) isDebugEnabled = true;

  writeLog(`received input : ${text}`);

  writeLog(`building map scoring collection`, true);
  for (let index = 0; index < wordsOrder.length; index++) {
    vanillaMap[wordsOrder[index]] = index;
  const vanillaMap: MapKvpScore = {};
    writeLog(`score for ${wordsOrder[index]} is ${index}`, true);
  }

  const csv = text.split(" ");
  const csvSanitized = csv.map((word) => word.replace(/[^a-zA-Z]/g, ""));
  writeLog(`splitting the text to words produced ${csv.length} words`, true);

  writeLog(`sorting the words...`, true);
  const sorted = csvSanitized.sort((word1, word2) => {
    const w1Upper = word1.toUpperCase();
    const w2Upper = word2.toUpperCase();

    writeLog(`inspecting word1 ${w1Upper} vs ${w2Upper}`, true);

    for (let i = 0; i < w1Upper.length; i++) {
      if (w2Upper.length < i) {
        writeLog(
          `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} the second word ends - the longer word should be after the shorter`,
          true
        );
        return -1; //word 1 is equal until now and it's longer , it should go after word 2
      }
      const letter1 = w1Upper[i];
      const letter2 = w2Upper[i];

      if (letter1 == letter2) {
        writeLog(
          `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} they are the same - jumping to the next letters`,
          true
        );
        continue; //same letters - continue down the string...
      }

      if (vanillaMap[letter1] > vanillaMap[letter2]) {
        writeLog(
          `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} the letter1 ${letter1} (position ${vanillaMap[letter1]}) is smaller than letter2 ${letter2} (position ${vanillaMap[letter2]})`,
          true
        );
        return 1;
      } else if (vanillaMap[letter1] < vanillaMap[letter2]) {
        writeLog(
          `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} the letter1 ${letter1} (position ${vanillaMap[letter1]}) is larger than letter2 ${letter2} (position ${vanillaMap[letter2]})`,
          true
        );
        return -1;
      }
    }

    if (w1Upper.length < w2Upper.length) {
      writeLog(
        `inspecting word1 ${w1Upper} vs ${w2Upper} word 2 is equal until now and it's longer , it should go after word 1`,
        true
      );
      return -1;
    }

    writeLog(
      `inspecting word1 ${w1Upper} vs ${w2Upper} words are the same`,
      true
    );
    return 0; //words are equal
  });

  writeLog(`*******************************************************`, false);

  for (const word of sorted) {
    process.stdout.write(`${word} `);
  }
  writeLog(``);
  writeLog(`*******************************************************`, false);

  process.exit(0);
};
