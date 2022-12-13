import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {Injectable} from "@angular/core";
import {NbAuthService} from "@nebular/auth";

@Injectable()
export class JwtBearerInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let reqToUse = req;

    const addJwt = this.authService.getToken()
      .pipe(switchMap(t => {
        const newHeaders = req.headers.set("Authorization", "Bearer " + t.getValue());
        reqToUse = req.clone<any>({headers: newHeaders});
        return next.handle(reqToUse);
      }));

    return this.authService.isAuthenticated()
      .pipe(switchMap(isAuth => {
        if (isAuth && this.shouldRequestBeAuthenticatedBasedOnUrl(req)) {
          return addJwt;
        }

        return next.handle(req);
      }));
  }

  private shouldRequestBeAuthenticatedBasedOnUrl(request: HttpRequest<any>) {
    return !request.url.includes("castvote/createTransaction");
  }
}
