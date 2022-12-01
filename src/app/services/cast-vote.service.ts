import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface CastVoteInitResponse {
  publicKey: string
}

@Injectable({
  providedIn: 'root'
})
export class CastVoteService {
  private static BASE_URL = environment.apiUrl + "/castvote";

  constructor(private httpClient: HttpClient) {
  }

  init(votingId: string): Observable<CastVoteInitResponse> {
    const url = CastVoteService.BASE_URL + "/init";
    return this.httpClient.post<CastVoteInitResponse>(url, {votingId: votingId});
  }
}
