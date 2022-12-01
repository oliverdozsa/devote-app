import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {NbAuthService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {Voting} from "../../services/voting";
import {CastVoteProgressComponent} from "./cast-vote-progress/cast-vote-progress.component";

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.scss']
})
export class CastVoteComponent implements OnDestroy {
  voting = new Voting();

  isUnlocked = false;
  isVotingLoaded = false;

  destroy$ = new Subject<void>();

  selectedOptions: any[] = [];

  private votingId: string = "";

  get isNotAllowedToCastVote() {
    return this.selectedOptions.length == 0 || !this.selectedOptions.every(i => i != null);
  }

  constructor(private authService: NbAuthService, private route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService, private dialogService: NbDialogService) {
    this.votingId = route.snapshot.paramMap.get("id")!;
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
    this.selectedOptions = new Array(voting.polls.length).fill(null);
  }
}
