import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NbAuthResult, NbAuthService} from "@nebular/auth";
import {NgxSpinnerService} from "ngx-spinner";
import {delay, finalize} from "rxjs";
import {AppRoutes} from "../../../app-routes";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent {
  private token: string | undefined;

  constructor(private route: ActivatedRoute, private authService: NbAuthService, private spinner: NgxSpinnerService,
              private router: Router) {
    this.token = route.snapshot.paramMap.get("token")!;
    this.loginThroughToken();
  }

  private loginThroughToken() {
    this.spinner.show();

    this.authService.authenticate("tokenauth", {token: this.token})
      .pipe(
        delay(1000),
        finalize(() => this.spinner.hide())
      )
      .subscribe(r => this.onAuthResultReceived(r));
  }

  private onAuthResultReceived(authResult: NbAuthResult) {
    if(authResult.isSuccess()) {
      this.router.navigate(["/" + AppRoutes.VOTINGS_WHERE_I_PARTICIPATE])
    }
  }
}
