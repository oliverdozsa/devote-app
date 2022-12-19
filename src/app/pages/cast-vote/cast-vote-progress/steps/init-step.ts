import {OrchestrationStep} from "./orchestration-step";
import {HttpErrorResponse} from "@angular/common/http";
import {delay, Observable, throwError} from "rxjs";
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
    }

    this.toastr.danger("Unknown status error during init!");
  }

  private handleInitError(errorText: string) {
    if (errorText.includes("has already started a session")) {
      this.toastr.warning("Session already started for user.")
      // TODO: When server is extended to return the public key in this case, handle it.
    } else if (errorText.includes("not initialized properly")) {
      this.toastr.warning("Please try again later!");
    }

    this.toastr.danger("Unknown error during init!");
  }
}
