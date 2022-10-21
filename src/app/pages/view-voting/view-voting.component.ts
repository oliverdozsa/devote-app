import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VotingsService} from "../../services/votings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NbToastrService} from "@nebular/theme";
import {Voting} from "../../services/voting";
import {finalize} from "rxjs";

@Component({
  selector: 'app-view-voting',
  templateUrl: './view-voting.component.html',
  styleUrls: ['./view-voting.component.scss']
})
export class ViewVotingComponent implements OnInit {
  voting: Voting | undefined = undefined;

  constructor(private route: ActivatedRoute, private votingsService: VotingsService,
              private spinner: NgxSpinnerService, private toastr: NbToastrService) {
    const votingId = Number(route.snapshot.paramMap.get("id"))!;
    this.getVoting(votingId);
  }

  getVoting(id: number) {
    this.spinner.show();
    this.votingsService.single(id)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: v => this.onVotingReceived(v),
        error: err => this.toastr.danger("Failed to get voting 😞.")
      });
  }

  ngOnInit(): void {
  }

  private onVotingReceived(voting: Voting) {
    this.voting = voting;
  }

}
