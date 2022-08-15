import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {NbAuthResult, NbAuthService} from "@nebular/auth";

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.scss']
})
export class LoginCallbackComponent implements OnDestroy {

  destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService, private router: Router, private route: ActivatedRoute) {
    const oauthProvider = route.snapshot.paramMap.get("oauthprov")!;

    console.log(`in login callback; provider is: ${oauthProvider}`);

    this.authService.authenticate(oauthProvider)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authResult: NbAuthResult) => {
        if (authResult.isSuccess() && authResult.getRedirect()) {
          this.router.navigateByUrl(authResult.getRedirect());
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
