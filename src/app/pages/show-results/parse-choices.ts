import {Voting} from "../../services/voting";
import {PollIndex, PollOptionCode} from "./show-results-operations";
import {BallotType} from "../../components/create-voting/create-voting-form";

export class ParseChoices {
  private static pattern = new RegExp("^([0-9]{4})+$");

  static parse(choices: string | undefined, voting: Voting): [PollIndex, PollOptionCode][] {
    const result: [PollIndex, PollOptionCode][] = [];

    if (choices == undefined || choices.length == 0 || choices.match(this.pattern) == null) {
      console.warn(`Invalid choices: ${choices}; ignored.`);
      return result;
    }

    let choicesToProcess = choices.slice();
    while (choicesToProcess != "") {
      const choice = choicesToProcess.slice(0, 4);

      const pollIndex: PollIndex = Number.parseInt(choice.slice(0, 2));
      const optionCode: PollOptionCode = Number.parseInt(choice.slice(2));

      result.push([pollIndex, optionCode]);

      choicesToProcess = choicesToProcess.slice(4);
    }

    if (voting.ballotType == BallotType.MULTI_POLL && this.doesContainDuplicateVoteForSamePoll(result)) {
      console.warn(`There are duplicate poll indices in choices: ${choices}; ignored`);
      return [];
    }

    return result;
  }

  static areChoicesValidFor(voting: Voting, choices: [PollIndex, PollOptionCode][]): boolean {
    if (choices.length == 0) {
      return true;
    }

    return choices.every(c => this.isChoiceValidIn(voting, c));
  }

  private static isChoiceValidIn(voting: Voting, choice: [PollIndex, PollOptionCode]) {
    const validPollIndices = voting.polls.map(p => p.index);
    if (!validPollIndices.includes(choice[0].valueOf())) {
      return false;
    }

    const validOptionCodesForPoll = voting.polls.find(p => p.index == choice[0].valueOf())!
      .pollOptions
      .map(o => o.code);
    return validOptionCodesForPoll.includes(choice[1].valueOf());


  }

  private static doesContainDuplicateVoteForSamePoll(choices: [PollIndex, PollOptionCode][]) {
    const uniquePollIndices = new Set<PollIndex>(choices.map(c => c[0]));
    return uniquePollIndices.size != choices.length;
  }
}
