import {Component, Input, OnInit} from '@angular/core';
import {PagingSource, VotingsService} from "../../services/votings.service";
import {VotingSummary} from "../../data/voting.summary";
import {Page} from "../../data/page";
import {NgxSpinnerService} from "ngx-spinner";
import {delay, finalize} from "rxjs";
import {NbToastrService} from "@nebular/theme";
import {AppRoutes} from 'src/app-routes';
import {loadOrDefaultProgresses, Progress, ProgressState} from "../../data/progress";
import {Voting} from "../../services/voting";

@Component({
  selector: 'app-votings-pagination',
  templateUrl: './votings-pagination.component.html',
  styleUrls: ['./votings.pagination.component.scss']
})
export class VotingsPaginationComponent implements OnInit {
  AppRoutes = AppRoutes;

  @Input()
  source: PagingSource = PagingSource.PUBLIC;

  @Input()
  allowCastVote: boolean = false;

  itemsPerPage = 10;

  votings: Page<VotingSummary> = {
    items: [],
    totalCount: 0
  };

  isLoading = true;
  currentPage: number = 1;

  private progresses: Map<string, Progress>;

  constructor(private votingsService: VotingsService, private spinner: NgxSpinnerService, private toastr: NbToastrService) {
    this.progresses = loadOrDefaultProgresses();
  }

  ngOnInit(): void {
    this.getVotings();
  }

  get totalPages(): number {
    return Math.ceil(this.votings.totalCount / this.itemsPerPage);
  }

  getVotings() {
    this.spinner.show();

    this.votingsService.getVotingsOf(this.source, this.currentPage, this.itemsPerPage)
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

  onSelectedPageChange(page: number) {
    this.currentPage = page;
    this.getVotings();
  }

  isExpired(voting: VotingSummary): boolean {
    const nowMillis = Date.now();
    const endMillis = Date.parse(voting.endDate)

    return endMillis <= nowMillis;
  }

  areResultsAvailable(voting: VotingSummary): boolean {
    return !this.isEncrypted(voting) || this.isEncryptionExpired(voting);
  }

  isAlreadyVoted(voting: VotingSummary) {
    return this.progresses.has(voting.id) && this.progresses.get(voting.id)!.state == ProgressState.Completed;
  }

  getEncryptedUntilString(voting: VotingSummary): string {
    return new Date(Date.parse(voting.encryptedUntil)).toLocaleString();
  }

  private isEncryptionExpired(voting: VotingSummary) {
    const nowMillis = Date.now();
    const encryptedUntilMillis = (Date.parse(voting.encryptedUntil));

    return encryptedUntilMillis <= nowMillis;
  }

  private isEncrypted(voting: VotingSummary): boolean {
    return voting.encryptedUntil != null;
  }
}
