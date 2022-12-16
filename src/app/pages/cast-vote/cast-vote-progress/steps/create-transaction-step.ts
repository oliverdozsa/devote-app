import {OrchestrationStep} from "./orchestration-step";
import {CastVoteOrchestration} from "../cast-vote-orchestration";
import {Progress, ProgressState} from "../progress";
import {CastVoteCreateTransactionResponse, CastVoteService} from "../../../../services/cast-vote.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NbToastrService} from "@nebular/theme";

export class CreateTransactionStep extends OrchestrationStep {
  private progress: Progress;
  private service: CastVoteService;
  private toastr: NbToastrService;

  constructor(orchestration: CastVoteOrchestration) {
    super(orchestration);

    this.progress = orchestration.progress;
    this.service = orchestration.castVoteService;
    this.toastr = orchestration.toastr;
  }

  execute(): void {
    this.progress.state = ProgressState.CreatingTransaction;

    this.service.createTransaction(this.progress.message!, this.progress.revealedSignature!)
      .subscribe({
        next: r => this.onCreateTransactionSuccess(r),
        error: e => this.onCreateTransactionError(e)
      });
  }

  override complete() {
    this.progress.state = ProgressState.CreatedTransaction;
    super.complete();
  }

  private onCreateTransactionSuccess(response: CastVoteCreateTransactionResponse) {
    this.progress.createAccountBlockchainTransaction = response.transaction;
    this.complete();
  }

  private onCreateTransactionError(error: HttpErrorResponse) {
    if(error.status == 403) {
      this.service.getTransactionString(this.progress.revealedSignature!)
        .subscribe({
          next: r => this.onCreateTransactionSuccess(r),
          error: e => this.toastr.danger("Failed to cast vote! Try again maybe. (error getting transaction)")
        });
    } else {
      this.toastr.danger("Failed to cast vote! Try again maybe. (error creating transaction)");
    }
  }
}
