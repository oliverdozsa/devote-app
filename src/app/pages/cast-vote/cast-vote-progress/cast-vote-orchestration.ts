import {Voting} from "../../../services/voting";
import {CastVoteService} from "../../../services/cast-vote.service";
import {CastVoteOperations} from "./cast-vote-operations";
import {NbToastrService} from "@nebular/theme";
import {Progress} from "./progress";
import {OrchestrationStep} from "./steps/orchestration-step";
import {InitStep} from "./steps/init-step";
import {SignEnvelopeStep} from "./steps/sign-envelope-step";
import {CreateTransactionStep} from "./steps/create-transaction-step";

export enum ProgressState {
  PreInit,
  Initialized,
  SigningEnvelope,
  SignedEnvelope,
  CreatingTransaction,
  CreatedTransaction,
  Completed
}

export class CastVoteOrchestration {
  current: StepNode | undefined;

  progress: Progress;
  operations: CastVoteOperations;

  private progresses: Map<string, Progress>;
  private start: StepNode;

  get isCompleted(): boolean {
    return this.current == undefined;
  }

  get progressPercent(): number {
    const totalSteps = CastVoteOrchestration.countStepsLeftFrom(this.start);
    const stepsLeft = CastVoteOrchestration.countStepsLeftFrom(this.current);
    const stepsCompleted = totalSteps - stepsLeft;

    return stepsCompleted / totalSteps * 100;
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

    this.start = this.buildSteps();
    this.current = this.determineStepToStartFrom();
  }

  describeProgressState(): string {
    switch (this.progress.state) {
      case ProgressState.PreInit:
        return "initializing"
      case ProgressState.Initialized:
        return "initialized";
      case ProgressState.SigningEnvelope:
        return "signing envelope";
      case ProgressState.SignedEnvelope:
        return "signed envelope";
      case ProgressState.CreatingTransaction:
        return "creating transaction";
      case ProgressState.CreatedTransaction:
        return "created transaction";
      default:
        return "<unknown>";
    }
  }

  castVote() {
    this.executeCurrentStepIfExists();
  }

  stepCompleted() {
    this.saveProgress();

    if(this.current != undefined) {
      this.current = this.current.next;
    }

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

  private determineStepToStartFrom(): StepNode | undefined {
    const currentState = this.progress.state;

    if(currentState == ProgressState.PreInit) {
      return this.start;
    }

    let startFrom = this.start;
    while(startFrom.progressStateWhenFinished != currentState) {
      startFrom = startFrom.next!;
    }

    return startFrom.next;
  }

  private executeCurrentStepIfExists() {
    if(this.current != undefined) {
      this.current.step.execute();
    }
  }

  private static countStepsLeftFrom(step: StepNode | undefined): number {
    let s = step;
    let left = 0;

    while(s != undefined) {
      left++;
      s = s.next;
    }

    return left;
  }

  private buildSteps(): StepNode {
    const init: StepNode = {
      step: new InitStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.Initialized
    };

    const signEnvelope: StepNode = {
      step: new SignEnvelopeStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.SignedEnvelope
    };

    const createTransaction: StepNode = {
      step: new CreateTransactionStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.CreatedTransaction
    }

    init.next = signEnvelope;
    signEnvelope.next = createTransaction;

    return init;
  }
}

interface StepNode {
  step: OrchestrationStep,
  next: StepNode | undefined,
  progressStateWhenFinished: ProgressState
}
