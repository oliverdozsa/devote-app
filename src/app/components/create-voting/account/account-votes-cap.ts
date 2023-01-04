import {environment} from "../../../../environments/environment";

export class AccountVotesCap {
  constructor(public network = "", public balance = -1) {
  }

  calculateMaxPossibleVotesCap(): number {
    if (this.network == "stellar") {
      return StellarAccountVotesCap.calculateMaxPossibleVotesCap(this.balance);
    }

    return 0;
  }
}

class StellarAccountVotesCap {
  static calculateMaxPossibleVotesCap(balanceXlm: number): number {
    const balanceMinusStartingCost = balanceXlm - (10 * environment.stellarNumOfVoteBuckets + 60)
    if (balanceMinusStartingCost > 0) {
      return Math.floor(balanceMinusStartingCost / 4);
    } else {
      return 0;
    }
  }
}
