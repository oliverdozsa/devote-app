import {OrchestrationStep} from "./orchestration-step";
import {CastVoteOrchestration} from "../cast-vote-orchestration";
import {Progress, ProgressState} from "../../../../data/progress";
import {CastVoteOperations} from "../cast-vote-operations";
import {Voting} from "../../../../services/voting";
import {NbToastrService} from "@nebular/theme";

export class CastVoteOnBlockchainStep extends OrchestrationStep {
  private operations: CastVoteOperations;
  private progress: Progress;
  private voting: Voting;
  private toastr: NbToastrService;
  private selectedOptions: any[];

  constructor(orchestration: CastVoteOrchestration) {
    super(orchestration);

    this.operations = orchestration.operations;
    this.progress = orchestration.progress;
    this.voting = orchestration.voting;
    this.toastr = orchestration.toastr;
    this.selectedOptions = orchestration.selectedOptions;
  }

  execute(): void {
    this.progress.state = ProgressState.CastingVote;
    this.progress.selectedOptions = this.selectedOptions;

    this.operations.submitAccountCreationTransaction(
      this.progress.createAccountBlockchainTransaction!,
      this.progress.voterAccount!
    ).subscribe({
      next: () => this.onAccountCreationTransactionSuccess(),
      error: () => this.toastr.danger("Failed to cast vote (error on submitting account creating tx). Try again maybe!")
    });
  }

  override complete() {
    this.progress.state = ProgressState.Completed;
    super.complete();
  }

  private onAccountCreationTransactionSuccess() {
    this.operations.castVote(this.progress.voterAccount!, this.progress.selectedOptions)
      .subscribe({
        next: txId => this.onCastVoteSuccess(txId),
        error: () => this.toastr.danger("Failed to cast vote (error on casting vote). Try again maybe!")
      });
  }

  private onCastVoteSuccess(transactionId: string) {
    this.progress.castedVoteTransactionId = transactionId;
    this.complete();
  }
}
