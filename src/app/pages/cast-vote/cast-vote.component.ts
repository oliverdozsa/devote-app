import {Component, OnDestroy} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {NbAuthService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {Voting} from "../../services/voting";
import {CastVoteProgressComponent} from "./cast-vote-progress/cast-vote-progress.component";
import {loadOrDefaultProgresses, Progress, ProgressState} from "../../data/progress";
import {AppRoutes} from "../../../app-routes";
import {BallotType} from "../../components/create-voting/create-voting-form";

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.scss']
})
export class CastVoteComponent implements OnDestroy {
  BallotType = BallotType;

  voting = new Voting();

  isUnlocked = false;
  isVotingLoaded = false;

  destroy$ = new Subject<void>();

  selectedOptions: any[] = [];

  private votingId: string = "";
  private progresses: Map<string, Progress>;

  get isNotAllowedToCastVote() {
    if (this.voting.ballotType == BallotType.MULTI_POLL) {
      return this.selectedOptions.length == 0 || !this.selectedOptions.every(i => i != null);
    } else if (this.voting.ballotType == BallotType.MULTI_CHOICE) {
      return this.selectedOptions.every(i => i == false) || this.isTooManyChoices;
    }

    return true;
  }

  get isAlreadyVoted(): boolean {
    return this.progresses.has(this.votingId) && (this.progresses.get(this.votingId)!.state == ProgressState.Completed ||
      this.progresses.get(this.votingId)!.state == ProgressState.CompletelyFailed);
  }

  get isTooManyChoices() {
    if(this.voting.ballotType == BallotType.MULTI_CHOICE) {
      const numAlreadyChosen = this.selectedOptions.filter(o => o == true).length;
      return numAlreadyChosen > this.voting.maxChoices!;
    }

    return false;
  }

  constructor(private authService: NbAuthService, private route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService, private dialogService: NbDialogService) {
    this.votingId = route.snapshot.paramMap.get("id")!;
    this.progresses = loadOrDefaultProgresses();

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.CAST_VOTE}/${this.votingId}`);

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

  onCastVoteClicked() {
    this.dialogService.open(CastVoteProgressComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: true,
      context: {
        voting: this.voting,
        selectedOptions: this.selectedOptions
      }
    });
  }

  onChoiceChanged(i: number) {
    this.selectedOptions[i] = !this.selectedOptions[i];
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
    this.getVoting();
  }

  private getVoting() {
    this.spinner.show();
    this.votingsService.single(this.votingId)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: v => this.onVotingReceived(v),
        error: err => this.toastr.danger("Failed to get voting 😞. TODO: check for unauth")
      });
  }

  private onVotingReceived(voting: Voting) {
    this.isVotingLoaded = true;
    this.voting = voting;

    if (this.voting.ballotType == BallotType.MULTI_POLL) {
      this.selectedOptions = new Array(voting.polls.length).fill(null);
    } else if (this.voting.ballotType == BallotType.MULTI_CHOICE) {
      const maxOptionCode = voting.polls[0].pollOptions
        .map(o => o.code)
        .reduce((p, c) => Math.max(p, c));
      this.selectedOptions = new Array(maxOptionCode + 1).fill(false);
    }
  }
}
