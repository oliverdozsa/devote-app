import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VotingsService {

  constructor(private httpClient: HttpClient) { }

  getPublic() {
    // TODO
  }
}
