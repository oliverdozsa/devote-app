import {Component, OnDestroy} from '@angular/core';
import {NbAuthService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbJSThemeOptions, NbThemeService, NbToastrService} from "@nebular/theme";
import {finalize, Subject, takeUntil} from "rxjs";
import {Poll, Voting} from "../../services/voting";
import {HttpErrorResponse} from "@angular/common/http";
import {AppRoutes} from "../../../app-routes";
import {CollectedVoteResults, ShowResultsOperations} from "./show-results-operations";
import {createBarChartConfig} from "./chart-options";

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
  areResultsAvailable = false;

  themeOptions: NbJSThemeOptions | undefined;
  isThemeAvailable = false;

  destroy$ = new Subject<void>();

  private results: CollectedVoteResults | undefined;


  constructor(private authService: NbAuthService, private route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService, private theme: NbThemeService) {
    this.votingId = route.snapshot.paramMap.get("id")!;

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.SHOW_RESULTS}/${this.votingId}`);

    authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: a => this.onIsAuthenticated(a)
      });

    theme.getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: t => this.onThemeChange(t)
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getChartOptionsForPoll(poll: Poll) {
    return createBarChartConfig(poll, this.results?.get(poll.index)!, this.themeOptions!);
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

    if (this.checkIfEncryptedAndDecryptionKeyNotPresent()) {
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
          next: r => this.onResultsAvailable(r)
        });
    }
  }

  private onGetVotingError(err: HttpErrorResponse) {
    this.spinner.hide();

    if (err.status == 403) {
      this.isWorking = false;

      if (this.isAuthenticated) {
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

  private onResultsAvailable(results: CollectedVoteResults) {
    this.areResultsAvailable = true;
    this.results = results;
  }

  private onThemeChange(themeOptions: NbJSThemeOptions) {
    this.isThemeAvailable = true;
    this.themeOptions = themeOptions;
  }
}
