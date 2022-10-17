import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {VotingSummary} from "../data/voting.summary";
import {Page} from "../data/page";
import {Observable} from "rxjs";
import {CreateVotingForm} from "../components/create-voting/create-voting-form";
import {CreateVotingRequest} from "./create-voting-request";

export enum PagingSource {
  PUBLIC,
  VOTE_CALLER,
  VOTER
}

@Injectable({
  providedIn: 'root'
})
export class VotingsService {
  constructor(private httpClient: HttpClient) {
  }

  create(form: CreateVotingForm): Observable<any> {
    const url = environment.apiUrl + "/voting";

    const request = CreateVotingRequest.fromCreateVotingForm(form);

    return this.httpClient.post(url, request);
  }

  getVotingsOf(source: PagingSource = PagingSource.PUBLIC, page: number = 1, itemsPerPage: number = 10): Observable<Page<VotingSummary>> {
    let url = environment.apiUrl;

    if (source == PagingSource.PUBLIC) {
      url += "/votings/public";
    } else if (source == PagingSource.VOTE_CALLER) {
      url += "/votings/votecaller";
    } else if (source == PagingSource.VOTER) {
      url += "/votings/voter";
    }

    const queryParams = new HttpParams()
      .set('offset', this.toOffset(page, itemsPerPage))
      .set('limit', itemsPerPage);

    return this.httpClient.get<Page<VotingSummary>>(url, {params: queryParams});

  }

  private toOffset(page: number, itemsPerPage: number): number {
    return (page - 1) * itemsPerPage
  }
}
