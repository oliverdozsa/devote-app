import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbToastrService} from "@nebular/theme";
import {Voting} from "../../services/voting";
import {finalize} from "rxjs";
import {CountdownConfig} from "ngx-countdown";

@Component({
  selector: 'app-view-voting',
  templateUrl: './view-voting.component.html',
  styleUrls: ['./view-voting.component.scss']
})
export class ViewVotingComponent {
  voting: Voting | undefined = undefined;

  public countDownConfigForVotingExpire: CountdownConfig = {
    formatDate: ({date}) => this.formatDate(date)
  }

  public countDownConfigForEncryptionExpire: CountdownConfig = {
    formatDate: ({date}) => this.formatDate(date)
  }

  constructor(private route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService) {
    const votingId = route.snapshot.paramMap.get("id")!;
    this.getVoting(votingId);
  }

  getVoting(id: string) {
    this.spinner.show();
    this.votingsService.single(id)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: v => this.onVotingReceived(v),
        error: err => this.toastr.danger("Failed to get voting 😞. TODO: check for unauth")
      });
  }

  get isVotingExpired(): boolean {
    return this.remainingTotalSecondsLeftUntilVotingEnds() == 0;
  }

  get isEncrypted(): boolean {
    return this.voting?.encryptedUntil != undefined;
  }

  get isEncryptionExpired(): boolean {
    return this.remainingTotalSecondsLeftUntilEncryptionEnds() == 0;
  }

  private onVotingReceived(voting: Voting) {
    this.voting = voting;
    this.countDownConfigForVotingExpire.leftTime = this.remainingTotalSecondsLeftUntilVotingEnds();
    this.countDownConfigForEncryptionExpire.leftTime = this.remainingTotalSecondsLeftUntilEncryptionEnds();
  }

  private remainingTotalSecondsLeftUntilVotingEnds(): number {
    if (this.voting) {
      return this.calcRemainingTotalSeconds(this.voting.endDate);
    }

    return 0;
  }

  private remainingTotalSecondsLeftUntilEncryptionEnds(): number {
    if (this.voting && this.isEncrypted) {
      return this.calcRemainingTotalSeconds(this.voting.encryptedUntil!);
    }

    return 0;
  }

  private calcRemainingTotalSeconds(dateUntil: string) {
    const now = Date.now();
    const end = Date.parse(dateUntil);

    const diffSeconds = Math.floor((end - now) / 1000);
    return diffSeconds > 0 ? diffSeconds : 0;
  }

  private formatDate(date: number) {
  const daysLeft = Math.floor(date / 1000 / 60 / 60 / 24);
  const hoursLeft = Math.floor((date / 1000 / 60 / 60) % 24);
  const minutesLeft = Math.floor((date / 1000 / 60) % 60);
  const secondsLeft = Math.floor((date / 1000) % 60);

  const daysLeftText = daysLeft > 0 ? `${daysLeft} days ` : '';
  const hoursLeftText = hoursLeft > 0 || daysLeft > 0 ? `${hoursLeft} hours ` : '';
  const minutesLeftText = minutesLeft > 0 || daysLeft > 0 || hoursLeft > 0 ? `${minutesLeft} minutes ` : '';
  const secondsLeftText = `${secondsLeft} seconds `;

  return daysLeftText + hoursLeftText + minutesLeftText + secondsLeftText;
}
}
