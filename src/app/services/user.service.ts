import {Injectable} from '@angular/core';
import {NbAuthService, NbAuthToken} from "@nebular/auth";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface UserInfo {
  name: string,
  pictureUrl: string,
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfoSubject: Subject<UserInfo> = new Subject();

  constructor(private authService: NbAuthService, private httpClient: HttpClient) {
  }

  getUserInfo(): Observable<UserInfo> {
    this.authService.getToken()
      .subscribe({
        next: t => this.onToken(t)
      });

    return this.userInfoSubject;
  }

  private onToken(token: NbAuthToken) {
    const userInfoUrl = environment.userInfoUrl
    this.httpClient.get(userInfoUrl, {
      headers: {
        "Authorization": "Bearer " + token.getValue()
      }
    })
      .pipe(
        map(auth0UserInfo => this.toUserInfo(auth0UserInfo))
      )
      .subscribe({
        next: r => this.userInfoSubject.next(r)
      })
  }

  private toUserInfo(auth0UserInfo: any): UserInfo {
    return {
      email: auth0UserInfo["email"],
      name: auth0UserInfo["name"],
      pictureUrl: auth0UserInfo["picture"]
    }
  }
}
