import {Component, OnDestroy} from '@angular/core';
import {NbAuthService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbToastrService} from "@nebular/theme";
import {finalize, Subject, takeUntil} from "rxjs";
import {Voting} from "../../services/voting";
import {HttpErrorResponse} from "@angular/common/http";
import {AppRoutes} from "../../../app-routes";
import {ShowResultsOperations} from "./show-results-operations";

enum RejectReason {
  None,
  VotingIsPrivateAndUserIsNotAllowed,
  VotingIsPrivateButUserIsUnauthenticated,
  VotingIsStillEncrypted
}

@Component({
  selector: 'app-show-results',
  templateUrl: './show-results.component.html',
  styleUrls: ['./show-results.component.scss']
})
export class ShowResultsComponent implements OnDestroy {
  RejectReason = RejectReason;
  reason = RejectReason.None;

  votingId: string;
  voting: Voting = new Voting();

  isWorking = true;
  isAuthenticated = false;

  destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService, private route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService) {
    this.votingId = route.snapshot.paramMap.get("id")!;

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.SHOW_RESULTS}/${this.votingId}`);

    authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: a => this.onIsAuthenticated(a)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onIsAuthenticated(isAuth: boolean) {
    this.isAuthenticated = isAuth;
    this.getVoting();
  }

  private getVoting() {
    this.spinner.show();
    this.votingsService.single(this.votingId)
      .subscribe({
        next: v => this.onVotingReceived(v),
        error: err => this.onGetVotingError(err)
      });
  }

  private onVotingReceived(voting: Voting) {
    this.voting = voting;

    if(this.checkIfEncryptedAndDecryptionKeyNotPresent()) {
      this.isWorking = false;
      this.spinner.hide();
      this.reason = RejectReason.VotingIsStillEncrypted;
    } else {
      ShowResultsOperations.getResultsOf(this.voting)
        .pipe(
          finalize(() => {
            this.isWorking = false;
            this.spinner.hide();
          })
        )
        .subscribe({
          // TODO
          next: r => {console.log(`results: ${JSON.stringify(Array.from(r.entries()))}`)}
        });
    }
  }

  private onGetVotingError(err: HttpErrorResponse) {
    this.spinner.hide();

    if(err.status == 403) {
      this.isWorking = false;

      if(this.isAuthenticated) {
        this.reason = RejectReason.VotingIsPrivateAndUserIsNotAllowed;
      } else {
        this.reason = RejectReason.VotingIsPrivateButUserIsUnauthenticated;
      }
    } else {
      this.toastr.danger("Failed to show results; try again maybe!");
    }
  }

  private checkIfEncryptedAndDecryptionKeyNotPresent() {
    return this.voting.encryptedUntil != null && this.voting.decryptionKey == null;
  }
}
