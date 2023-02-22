import {Component, OnDestroy} from '@angular/core';
import {NbAuthService} from "@nebular/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbThemeService, NbToastrService} from "@nebular/theme";
import {finalize, Subject, takeUntil} from "rxjs";
import {Poll, Voting} from "../../services/voting";
import {HttpErrorResponse} from "@angular/common/http";
import {AppRoutes} from "../../../app-routes";
import {CollectedVoteResults, ShowResultsOperations} from "./show-results-operations";
import {Chart, ChartHandling} from "./chart-handling";
import {loadOrDefaultProgresses, Progress} from "../../data/progress";
import {getTransactionLink} from "./transaction-link";
import {BallotType} from "../../components/create-voting/create-voting-form";


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
  isVotingReceived = false;
  doesResultExist = false;

  chartHandling: ChartHandling = new ChartHandling();

  destroy$ = new Subject<void>();

  progress: Progress | undefined;

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
      });

     const progresses = loadOrDefaultProgresses();
     if(progresses.has(this.votingId)) {
       this.progress = progresses.get(this.votingId);
     }
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

  onRefreshClicked() {
    ShowResultsOperations.clearResultsOf(this.voting);
    this.getResults();
  }

  get hasVotingTransaction(): boolean {
    return this.progress != undefined && this.isVotingReceived;
  }
  get transactionLink(): string {
    return getTransactionLink(this.voting, this.progress!.castedVoteTransactionId!);
  }

  getChosenOptionsFor(poll: Poll): string {
    if(this.progress == undefined) {
      return "";
    }

    if(this.voting.ballotType == BallotType.MULTI_POLL) {
      const chosenOptionCode = this.progress!.selectedOptions![poll.index - 1];
      return poll.pollOptions.find(o => o.code == chosenOptionCode)!.name;
    } else if(this.voting.ballotType == BallotType.MULTI_CHOICE) {
      return poll.pollOptions
        .filter(o => this.progress!.selectedOptions[o.code] == true)
        .map(o => o.name)
        .join(", ");
    }

    return "";
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
    this.isVotingReceived = true;
    this.spinner.hide();

    if (this.checkIfEncryptedAndDecryptionKeyNotPresent()) {
      this.isWorking = false;
      this.spinner.hide();
      this.reason = RejectReason.VotingIsStillEncrypted;
    } else {
      this.getResults();
    }
  }

  private getResults() {
    this.areResultsAvailable = false;
    this.isWorking = true;
    this.doesResultExist = false;

    const sub = ShowResultsOperations.getResultsOf(this.voting)
      .pipe(
        finalize(() => {
          this.isWorking = false;
          sub.unsubscribe();
        })
      )
      .subscribe({
        next: r => this.onResultsAvailable(r),
        error: e => this.onGenericError(e)
      });
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
    if(!this.doesResultExist) {
      this.doesResultExist = results.size > 0 && Array.from(results.entries())
        .every(v => v[1].size != 0);
    }

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
