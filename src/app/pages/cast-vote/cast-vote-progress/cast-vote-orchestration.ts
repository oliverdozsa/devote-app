import {Voting} from "../../../services/voting";
import {CastVoteService} from "../../../services/cast-vote.service";
import {CastVoteOperations} from "./cast-vote-operations";
import {NbToastrService} from "@nebular/theme";
import {Progress} from "./progress";
import {OrchestrationStep} from "./steps/orchestration-step";
import {InitStep} from "./steps/init-step";

export enum ProgressState {
  PreInit,
  Initialized
}

export class CastVoteOrchestration {
  steps: OrchestrationStep[];
  currentStepIndex;

  progress: Progress;
  operations: CastVoteOperations;

  private progresses: Map<string, Progress>;

  get isCompleted(): boolean {
    return this.currentStepIndex == this.steps.length;
  }

  /*
  * Steps:
  * 1. Generate an account, store data about it in localstorage
  * 2. Init the session. Store the resulting public key in local storage
  * 3. Generate envelope for chosen option. Store it in local storage.
  * 4. Make the commission sign the envelope. The returned signature doesn't need to be stored as it can be queried later.
  * 5. Create the revealed signature from signature on the envelope.
  * 6. Become anonymous. Get the transaction from the commission by presenting the revealed signature and message.
  *    The resulting transaction doesn't need to be stored as it can be queried later.
  * 7. Use the transaction to obtain the vote token.
  * 8. Cast the vote. Encrypt the options if needed by using the commission.
  * */

  constructor(public voting: Voting, public selectedOptions: any[],
              public castVoteService: CastVoteService, public toastr: NbToastrService) {
    this.operations = new CastVoteOperations(voting, castVoteService);
    this.progresses = this.getAndCreateIfNeededProgresses();
    this.progress = this.getAndCreateIfNeededProgress();

    this.steps = [
      new InitStep(this)
    ];

    this.currentStepIndex = this.determineStepToStartFrom();
  }

  describeProgressState(): string {
    if (this.progress.state == ProgressState.PreInit) {
      return "Starting initialization";
    } else if (this.progress.state == ProgressState.Initialized) {
      return "Initialized"
    }

    return "<Unknown state>";
  }

  castVote() {
    this.executeCurrentStepIfExists();
  }

  stepCompleted() {
    this.saveProgress();

    this.currentStepIndex += 1;
    this.executeCurrentStepIfExists();
  }

  private getAndCreateIfNeededProgresses(): Map<string, Progress> {
    let progressesStr = localStorage.getItem("progresses");

    if (progressesStr == null) {
      return new Map<string, Progress>()
    }

    return new Map<string, Progress>(JSON.parse(progressesStr));
  }

  private getAndCreateIfNeededProgress(): Progress {
    if (!this.progresses.has(this.voting.id)) {
      this.progresses.set(this.voting.id, new Progress());
    }

    return this.progresses.get(this.voting.id)!;
  }

  private saveProgress() {
    const progressesJsonStr = JSON.stringify(Array.from(this.progresses.entries()));
    localStorage.setItem("progresses", progressesJsonStr);
  }

  private determineStepToStartFrom(): number {
    if (this.progress.state == ProgressState.PreInit) {
      return 0;
    } else if (this.progress.state == ProgressState.Initialized) {
      return 1;
    }

    return 0;
  }

  private executeCurrentStepIfExists() {
    if(this.currentStepIndex < this.steps.length) {
      this.steps[this.currentStepIndex].execute();
    }
  }
}

