import {NbAuthResult, NbAuthService} from "@nebular/auth";
import {AppRoutes} from "../app-routes";
import {Router} from "@angular/router";

export class Authentication {
  constructor(private authService: NbAuthService, private router: Router) {
  }

  login() {
    this.authService
      .authenticate("auth0")
      .subscribe((authResult: NbAuthResult) => {
      });
  }

  logout() {
    this.authService
      .logout("auth0")
      .subscribe((authResult: NbAuthResult) => {
        this.router.navigate(["/" + AppRoutes.HOME]);
      });

    this.authService
      .logout("tokenauth")
      .subscribe((authResult: NbAuthResult) => {
        this.router.navigate(["/" + AppRoutes.HOME]);
      });
  }
}
