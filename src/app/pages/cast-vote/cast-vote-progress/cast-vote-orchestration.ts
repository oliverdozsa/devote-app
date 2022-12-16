import {Voting} from "../../../services/voting";
import {CastVoteService} from "../../../services/cast-vote.service";
import {CastVoteOperations} from "./cast-vote-operations";
import {NbToastrService} from "@nebular/theme";
import {Progress, ProgressState} from "./progress";
import {OrchestrationStep} from "./steps/orchestration-step";
import {InitStep} from "./steps/init-step";
import {SignEnvelopeStep} from "./steps/sign-envelope-step";
import {CreateTransactionStep} from "./steps/create-transaction-step";
import {CastVoteOnBlockchainStep} from "./steps/cast-vote-on-blockchain-step";

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

  constructor(public voting: Voting, public selectedOptions: any[],
              public castVoteService: CastVoteService, public toastr: NbToastrService) {
    this.operations = new CastVoteOperations(voting, castVoteService);
    this.progresses = this.getAndCreateIfNeededProgresses();
    this.progress = this.getAndCreateIfNeededProgress();

    this.start = this.buildSteps();
    this.current = this.determineStepToStartFrom();
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
    const initStep: StepNode = {
      step: new InitStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.Initialized
    };

    const signEnvelopeStep: StepNode = {
      step: new SignEnvelopeStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.SignedEnvelope
    };

    const createTransactionStep: StepNode = {
      step: new CreateTransactionStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.CreatedTransaction
    }

    const castVoteOnBlockchainStep: StepNode = {
      step: new CastVoteOnBlockchainStep(this),
      next: undefined,
      progressStateWhenFinished: ProgressState.Completed
    };

    initStep.next = signEnvelopeStep;
    signEnvelopeStep.next = createTransactionStep;
    createTransactionStep.next = castVoteOnBlockchainStep;

    return initStep;
  }
}

interface StepNode {
  step: OrchestrationStep,
  next: StepNode | undefined,
  progressStateWhenFinished: ProgressState
}
