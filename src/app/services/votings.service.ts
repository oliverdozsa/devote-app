import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {VotingSummary} from "../data/voting.summary";
import {Page} from "../data/page";
import {delay, finalize, Observable} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class VotingsService {
  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService) {
  }

  getPublic(page: number = 1, itemsPerPage: number = 10): Observable<Page<VotingSummary>> {
    const url = environment.apiUrl + "/votings/public";
    const queryParams = new HttpParams()
      .set('offset', this.toOffset(page, itemsPerPage))
      .set('limit', itemsPerPage);

    this.spinner.show();

    return this.httpClient.get<Page<VotingSummary>>(url, {params: queryParams})
      .pipe(
        delay(700),
        finalize(() => this.spinner.hide())
      );
  }

  private toOffset(page: number, itemsPerPage: number): number {
    return (page - 1) * itemsPerPage
  }
}
