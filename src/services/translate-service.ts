import { Logger } from "./logging";

type MapKvpScore = { [key: string]: string | number };

export class TranslateService {
  private language: string[];
  private logger: Logger;
  public constructor(language: string[], logger: Logger) {
    if (!language) throw new Error(`language is empty`);
    this.language = language;

    if (!logger) throw new Error(`logger is empty`);
    this.logger = logger;
  }

  public translate(text: string) {
    const vanillaMap: MapKvpScore = {};
    this.logger.WriteLog(`building map scoring collection`, true);
    for (let index = 0; index < this.language.length; index++) {
      vanillaMap[this.language[index]] = index;
      this.logger.WriteLog(
        `score for ${this.language[index]} is ${index}`,
        true
      );
    }

    const csv = text.split(" ");
    const csvSanitized = csv.map((word) => word.replace(/[^a-zA-Z]/g, ""));
    this.logger.WriteLog(
      `splitting the text to words produced ${csv.length} words`,
      true
    );

    this.logger.WriteLog(`sorting the words...`, true);
    const sorted = csvSanitized.sort((word1, word2) => {
      const w1Upper = word1.toUpperCase();
      const w2Upper = word2.toUpperCase();

      this.logger.WriteLog(`inspecting word1 ${w1Upper} vs ${w2Upper}`, true);

      for (let i = 0; i < w1Upper.length; i++) {
        if (w2Upper.length < i) {
          this.logger.WriteLog(
            `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} the second word ends - the longer word should be after the shorter`,
            true
          );
          return 1; //word 1 is equal until now and it's longer , it should go after word 2
        }
        const letter1 = w1Upper[i];
        const letter2 = w2Upper[i];

        if (letter1 == letter2) {
          this.logger.WriteLog(
            `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} they are the same - jumping to the next letters`,
            true
          );
          continue; //same letters - continue down the string...
        }

        if (vanillaMap[letter1] > vanillaMap[letter2]) {
          this.logger.WriteLog(
            `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} the letter1 ${letter1} (position ${vanillaMap[letter1]}) is smaller than letter2 ${letter2} (position ${vanillaMap[letter2]})`,
            true
          );
          return 1;
        } else if (vanillaMap[letter1] < vanillaMap[letter2]) {
          this.logger.WriteLog(
            `inspecting word1 ${w1Upper} vs ${w2Upper} in position ${i} the letter1 ${letter1} (position ${vanillaMap[letter1]}) is larger than letter2 ${letter2} (position ${vanillaMap[letter2]})`,
            true
          );
          return -1;
        }
      }

      if (w1Upper.length < w2Upper.length) {
        this.logger.WriteLog(
          `inspecting word1 ${w1Upper} vs ${w2Upper} word 2 is equal until now and it's longer , it should go after word 1`,
          true
        );
        return -1;
      }

      this.logger.WriteLog(
        `inspecting word1 ${w1Upper} vs ${w2Upper} words are the same`,
        true
      );
      return 0; //words are equal
    });

    return sorted;
  }
}
