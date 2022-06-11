import { TranslateService } from "../../src/services/translate-service";
import { Logger } from "../../src/services/logging";

describe("translation from english to heb service",()=>{
    describe(`translation service`,()=>{
        it(`should translate the main text`,async()=>{

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

              const logger = new Logger(false);
              const translate = new TranslateService(wordsOrder,logger);

              const results = translate.translate("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua");
              
              const resultsAsText = results.join(' ');
              const expected = "adipiscing aliqua amet do dolor dolore tempor labore Lorem magna sit sed incididunt ipsum ut consectetur et elit eiusmod";

            expect(resultsAsText).toBe(expected);
        });
    });
});