import {Component, OnInit} from '@angular/core';
import {VotingsService} from "../../services/votings.service";
import {VotingSummary} from "../../data/voting.summary";
import {Page} from "../../data/page";
import {NgxSpinnerService} from "ngx-spinner";
import {delay, finalize} from "rxjs";

@Component({
  selector: 'app-votings-pagination',
  templateUrl: './votings-pagination.component.html',
  styleUrls: ['./votings.pagination.component.scss']
})
export class VotingsPaginationComponent implements OnInit {
  votings: Page<VotingSummary> = {
    items: [],
    totalCount: 0
  };

  isLoading = true;
  currentPage: number = 1;

  constructor(private votingsService: VotingsService, private spinner: NgxSpinnerService) {
    this.getVotings();
  }

  ngOnInit(): void {
  }

  getVotings() {
    this.spinner.show();

    // TODO: make voting source configurable
    this.votingsService.getPublic(this.currentPage)
      .pipe(
        delay(700),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: p => this.onVotingsPageReceived(p)
      });
  }



  onVotingsPageReceived(page: Page<VotingSummary>) {
      this.votings = page;
  }
}
