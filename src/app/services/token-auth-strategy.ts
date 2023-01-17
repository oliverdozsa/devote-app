import {NbAuthResult, NbAuthStrategy, NbAuthStrategyClass, NbAuthStrategyOptions} from "@nebular/auth";
import {catchError, map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class TokenAuthStrategy extends NbAuthStrategy {
  private static apiUrl = environment.apiUrl + "/tokenauth";
  private static currentInviteToken: string | undefined;

  static setup(options: NbAuthStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
    return [TokenAuthStrategy, options];
  }

  constructor(protected httpClient: HttpClient) {
    super();
  }

  authenticate(data?: any): Observable<NbAuthResult> {
    return this.httpClient.get<TokenAuthResponse>(TokenAuthStrategy.apiUrl + "/" + data["token"])
      .pipe(
        map(r => {
          TokenAuthStrategy.currentInviteToken = r.token;
          return new NbAuthResult(
            true,
            r,
            "/",
            [],
            ['Success!'],
            this.createToken(r.token)
          );
        }),
        catchError(r => {
          return of(new NbAuthResult(false, r, "/", ["Failed to access through token!"]));
        })
      );
  }

  logout(): Observable<NbAuthResult> {
    TokenAuthStrategy.currentInviteToken = undefined;
    return of(new NbAuthResult(true));
  }

  refreshToken(data?: any): Observable<NbAuthResult> {
    if(TokenAuthStrategy.currentInviteToken != undefined) {
      return this.authenticate({token: TokenAuthStrategy.currentInviteToken})
    } else {
      return of(new NbAuthResult(false, undefined, "/", ["Failed to refresh token!"]));
    }
  }

  register(data?: any): Observable<NbAuthResult> {
    throw new Error("Register is not supported by token auth.");
  }

  requestPassword(data?: any): Observable<NbAuthResult> {
    throw new Error("Request password is not supported by token auth.");
  }

  resetPassword(data?: any): Observable<NbAuthResult> {
    throw new Error("Reset password is not supported by token auth.");
  }
}

interface TokenAuthResponse {
  token: string;
}
