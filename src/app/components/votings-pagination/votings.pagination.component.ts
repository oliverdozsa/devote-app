import {Component, Input} from '@angular/core';
import {PagingSource, VotingsService} from "../../services/votings.service";
import {VotingSummary} from "../../data/voting.summary";
import {Page} from "../../data/page";
import {NgxSpinnerService} from "ngx-spinner";
import {delay, finalize} from "rxjs";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-votings-pagination',
  templateUrl: './votings-pagination.component.html',
  styleUrls: ['./votings.pagination.component.scss']
})
export class VotingsPaginationComponent {
  @Input()
  source: PagingSource = PagingSource.PUBLIC;

  votings: Page<VotingSummary> = {
    items: [],
    totalCount: 0
  };

  isLoading = true;
  currentPage: number = 1;

  constructor(private votingsService: VotingsService, private spinner: NgxSpinnerService, private toastr: NbToastrService) {
    this.getVotings();
  }

  getVotings() {
    this.spinner.show();

    this.votingsService.getVotingsOf(this.source, this.currentPage)
      .pipe(
        delay(700),
        finalize(() => this.onGetVotingsFinished())
      )
      .subscribe({
        next: p => this.onVotingsPageReceived(p),
        error: () => this.toastr.danger("Failed to get votings!")
      });
  }

  onVotingsPageReceived(page: Page<VotingSummary>) {
      this.votings = page;
  }

  onGetVotingsFinished() {
    this.spinner.hide();
    this.isLoading = false;
  }
}
