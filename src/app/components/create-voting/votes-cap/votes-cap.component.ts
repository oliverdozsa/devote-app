import {Component, Input, ViewChild} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-votes-cap',
  templateUrl: './votes-cap.component.html',
  styleUrls: ['./votes-cap.component.scss']
})
export class VotesCapComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  get shouldWarn(): boolean {
    return this.shouldWarnDueToBalance() || this.shouldWarnDueToMax();
  }

  get popoverText() {
    if (this.shouldWarnDueToBalance() && !this.shouldWarnDueToMax()) {
      return `Not enough balance for chosen votes cap! The maximum possible with this balance is ${this.calculateMaxPossibleVotesCap()}.`;
    }

    return `The maximum number of votes is limited to ${environment.maxVotesCap.toLocaleString()}.`;
  }

  get max() {
    return environment.maxVotesCap;
  }

  constructor() {
  }

  private calculateMaxPossibleVotesCap(): number | undefined {
    if (!this.form.accountBalance.isNotFound && this.form.accountBalance.value != -1) {
      return this.form.accountVotesCap.calculateMaxPossibleVotesCap();
    }

    return undefined;
  }

  private shouldWarnDueToBalance() {
    const maxPossibleVotesCap = this.calculateMaxPossibleVotesCap();
    return maxPossibleVotesCap != undefined &&
      this.form.votesCap != undefined &&
      maxPossibleVotesCap < this.form.votesCap;
  }

  private shouldWarnDueToMax() {
    if (this.form.votesCap == undefined) {
      return false;
    }

    return this.form.votesCap > this.max;
  }
}
