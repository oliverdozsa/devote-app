import {Component, OnDestroy} from '@angular/core';
import {NbAuthService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbThemeService, NbToastrService} from "@nebular/theme";
import {finalize, Subject, takeUntil} from "rxjs";
import {Poll, Voting} from "../../services/voting";
import {HttpErrorResponse} from "@angular/common/http";
import {AppRoutes} from "../../../app-routes";
import {CollectedVoteResults, ShowResultsOperations} from "./show-results-operations";
import {Chart, ChartHandling} from "./chart-handling";


enum RejectReason {
  None,
  VotingIsPrivateAndUserIsNotAllowed,
  VotingIsPrivateButUserIsUnauthenticated,
  VotingIsStillEncrypted,
  Unknown
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

  chartHandling: ChartHandling = new ChartHandling();

  destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService, route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService, themeService: NbThemeService) {
    this.votingId = route.snapshot.paramMap.get("id")!;

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.SHOW_RESULTS}/${this.votingId}`);

    authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: a => this.onIsAuthenticated(a),
        error: e => this.onGenericError(e)
      });

    themeService.getJsTheme()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: o => this.chartHandling.updateThemeOptions(o),
        error: e => this.onGenericError(e)
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getIconChartForButton(poll: Poll) {
    const chart = this.chartHandling.getChartOf(poll);
    if(chart == Chart.Bar) {
      return "bar-chart-outline";
    } else {
      return "pie-chart-outline";
    }
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
          takeUntil(this.destroy$),
          finalize(() => {
            this.isWorking = false;
            this.spinner.hide();
          })
        )
        .subscribe({
          next: r => this.onResultsAvailable(r),
          error: e => this.onGenericError(e)
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
    this.chartHandling.updateResults(results, this.voting.polls);
  }

  private onGenericError(err: any) {
    this.reason = RejectReason.Unknown;
    this.isWorking = false;
    this.spinner.hide();

    console.log(`Something went wrong. err: ${JSON.stringify(err)}`);
  }
}
