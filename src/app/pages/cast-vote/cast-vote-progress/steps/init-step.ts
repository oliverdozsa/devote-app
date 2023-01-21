import {OrchestrationStep} from "./orchestration-step";
import {HttpErrorResponse} from "@angular/common/http";
import {delay} from "rxjs";
import {CastVoteOrchestration} from "../cast-vote-orchestration";
import {Progress, ProgressState} from "../../../../data/progress";
import {CastVoteInitResponse, CastVoteService} from "../../../../services/cast-vote.service";
import {CastVoteOperations} from "../cast-vote-operations";
import {Voting} from "../../../../services/voting";
import {NbToastrService} from "@nebular/theme";

export class InitStep extends OrchestrationStep {
  private progress: Progress;
  private service: CastVoteService;
  private operations: CastVoteOperations;
  private voting: Voting;
  private toastr: NbToastrService;

  constructor(orchestration: CastVoteOrchestration) {
    super(orchestration);

    this.progress = orchestration.progress;
    this.service = orchestration.castVoteService;
    this.operations = orchestration.operations;
    this.voting = orchestration.voting;
    this.toastr = orchestration.toastr;
  }

  execute(): void {
    this.progress.network = this.voting.network;

    this.service.init(this.orchestration.voting.id)
      .pipe(
        delay(1500)
      )
      .subscribe({
        next: v => this.onInitSuccess(v),
        error: e => this.onInitError(e)
      })
  }

  private onInitSuccess(response: CastVoteInitResponse) {
    this.progress.publicKeyForEnvelope = response.publicKey;
    this.progress.state = ProgressState.Initialized;

    this.complete();
  }

  private onInitError(error: HttpErrorResponse) {
    if (error.status == 403) {
      const errorText = String(error.error);
      this.handleInitError(errorText)
    } else {
      this.toastr.danger("Unknown status error during init!");
    }
  }

  private handleInitError(errorText: string) {
    if (errorText.includes("has already started a session")) {
      this.handleAlreadyInitializedError();
    } else if (errorText.includes("not initialized properly")) {
      this.toastr.warning("Please try again later!");
    } else {
      this.toastr.danger("Unknown error during init!");
    }
  }

  private handleAlreadyInitializedError() {
    if(this.progress.publicKeyForEnvelope != undefined) {
      this.progress.state = ProgressState.Initialized;
      this.complete();
    } else {
      this.toastr.warning("You've tried to vote before!", "Cannot cast vote!", {duration: 5000});
      this.fail();
    }
  }
}
