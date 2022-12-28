import {Poll, PollOption, Voting} from "../../services/voting";
import {delay, finalize, Observable, of, tap} from "rxjs";
import {Buffer} from "buffer";
import * as CryptoJS from "crypto-js";
import {StellarShowResultsOperation} from "./stellar-show-results-operation";

export type PollIndex = Number;
export type PollOptionCode = Number;
export type CollectedVoteResults = Map<PollIndex, Map<PollOptionCode, Number>>;

export class ShowResultsOperations {
  static cachedResults: Map<String, CollectedVoteResults> = new Map<String, CollectedVoteResults>();
  private static isCacheLoaded = false;

  static getResultsOf(voting: Voting): Observable<CollectedVoteResults> {
    this.tryLoadCachedIfNeeded();

    if(this.cachedResults.has(voting.id)) {
      return of(this.cachedResults.get(voting.id)!)
        .pipe(
          delay(1000)
        );
    }

    if (voting.network == "stellar") {
      return StellarShowResultsOperation.getResultsOf(voting)
        .pipe(
          tap(r => this.addToCached(voting.id, r)),
          finalize(() => this.saveCached())
        );
    }

    return of(new Map());
  }

  private static addToCached(votingId: string, results: CollectedVoteResults) {
    this.cachedResults.set(votingId, results);
  }

  private static saveCached() {
    const replacer = (key: any, value: any) => {
      if(value instanceof Map) {
        return {
          dataType: "Map",
          value: Array.from(value.entries()),
        };
      } else {
        return value;
      }
    }

    const cachedResultsStr = JSON.stringify(this.cachedResults, replacer);
    localStorage.setItem("voteResults", cachedResultsStr)
  }

  private static tryLoadCachedIfNeeded() {
    if(this.isCacheLoaded) {
      return;
    }

    const reviver = (key: any, value: any) => {
      if(typeof value === "object" && value != null && value.dataType == "Map") {
        return new Map(value.value)
      }

      return value;
    }

    if(localStorage.getItem("voteResults")) {
      this.cachedResults = JSON.parse(localStorage.getItem("voteResults")!, reviver)
    } else {
      this.cachedResults = new Map<String, CollectedVoteResults>();
    }

    this.isCacheLoaded = true;
  }
}

export class VoteResults {
  public collected: Map<PollIndex, Map<PollOptionCode, Number>> = new Map<PollIndex, Map<PollOptionCode, Number>>();
  private decryptChoices: DecryptChoices | undefined;

  constructor(private voting: Voting) {
    if (this.voting.decryptionKey) {
      this.decryptChoices = new DecryptChoices(this.voting.decryptionKey);
    }
  }

  public addChoices(choicesRaw: string | undefined) {
    let choices = choicesRaw;

    if (this.voting.decryptionKey != null) {
      choices = this.decryptChoices?.decrypt(choices);
    }

    const parsedChoices: [PollIndex, PollOptionCode][] = ParseChoices.parse(choices);

    if(ParseChoices.areChoicesValidFor(this.voting, parsedChoices)) {
      this.addParsedChoices(parsedChoices);
    } else {
      console.warn(`Choices: ${choices} are not valid in voting; ignored`);
    }
  }

  private addParsedChoices(choices: [PollIndex, PollOptionCode][]) {
    choices.forEach(c => this.addParsedChoice(c))
  }

  private addParsedChoice(choice: [PollIndex, PollOptionCode]) {
    if(!this.collected.has(choice[0])) {
      this.collected.set(choice[0], new Map<PollOptionCode, Number>());
    }

    const resultsOfPoll = this.collected.get(choice[0])!;

    if(resultsOfPoll.has(choice[1])){
      const currentVotesForOption = resultsOfPoll.get(choice[1])!.valueOf();
      resultsOfPoll.set(choice[1], currentVotesForOption + 1);
    } else {
      resultsOfPoll.set(choice[1], 1);
    }
  }
}

export class ParseChoices {
  private static pattern = new RegExp("^([0-9]{4})+$");

  static parse(choices: string | undefined): [PollIndex, PollOptionCode][] {
    const result: [PollIndex, PollOptionCode][] = [];

    if(choices == undefined || choices.length == 0 || choices.match(this.pattern) == null) {
      console.warn(`Invalid choices: ${choices}; ignored.`);
      return result;
    }

    let choicesToProcess = choices.slice();
    while(choicesToProcess != "") {
      const choice = choicesToProcess.slice(0, 4);

      const pollIndex: PollIndex = Number.parseInt(choice.slice(0, 2));
      const optionCode: PollOptionCode = Number.parseInt(choice.slice(2));

      result.push([pollIndex, optionCode]);

      choicesToProcess = choicesToProcess.slice(4);
    }

    if(this.doesContainDuplicateVoteForSamePoll(result)) {
      console.warn(`There are duplicate poll indices in choices: ${choices}; ignored`);
      return [];
    }

    return result;
  }

  static areChoicesValidFor(voting: Voting, choices: [PollIndex, PollOptionCode][]): boolean {
    if(choices.length == 0) {
      return true;
    }

    return choices.every(c => this.isChoiceValidIn(voting, c));
  }

  private static isChoiceValidIn(voting: Voting, choice: [PollIndex, PollOptionCode]) {
    const validPollIndices = voting.polls.map(p => p.index);
    if(!validPollIndices.includes(choice[0].valueOf())) {
      return false;
    }

    const validOptionCodesForPoll = voting.polls.find(p => p.index == choice[0].valueOf())!
      .pollOptions
      .map(o => o.code);
    if(!validOptionCodesForPoll.includes(choice[1].valueOf())) {
      return false;
    }

    return true;
  }

  private static doesContainDuplicateVoteForSamePoll(choices: [PollIndex, PollOptionCode][]){
    const uniquePollIndices = new Set<PollIndex>(choices.map(c => c[0]));
    return uniquePollIndices.size != choices.length;
  }
}

export class DecryptChoices {
  static RANDOM_IV_LENGTH = 8;

  constructor(private decryptionKeyBase64: string) {
  }

  decrypt(choices: string | undefined): string {
    if(choices == undefined || choices.length < 28) {
      console.warn(`Invalid encrypted choices: ${choices}`);
      return "";
    }

    const randomIvAndCipherBuffer = Buffer.from(choices, "base64");

    const randomIvBase64 = randomIvAndCipherBuffer.slice(0, DecryptChoices.RANDOM_IV_LENGTH).toString("base64");
    const cipherBase64 = randomIvAndCipherBuffer.slice(DecryptChoices.RANDOM_IV_LENGTH).toString("base64");

    const key = CryptoJS.enc.Base64.parse(this.decryptionKeyBase64);
    const iv = CryptoJS.enc.Base64.parse(randomIvBase64);

    return CryptoJS.AES.decrypt(cipherBase64, key, {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding
    }).toString(CryptoJS.enc.Utf8);
  }
}
