import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserInfo, UserService} from "../../services/user.service";
import {finalize, pipe, Subject, takeUntil} from "rxjs";
import {AppRoutes} from "../../../app-routes";
import {NbAuthService} from "@nebular/auth";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnDestroy {
  isUnlocked = false;
  isLoading: boolean = false;
  userInfo: UserInfo | undefined;

  destroy$ = new Subject<void>();

  constructor(private userService: UserService, private authService: NbAuthService) {
    this.isLoading = true;

    authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: a => this.onIsAuthenticated(a)
      });

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.VOTINGS_WHERE_I_PARTICIPATE}`);

    userService.getUserInfo()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({next: u => this.onUserInfoReceived(u)})
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private onUserInfoReceived(userInfo: UserInfo) {
    this.isLoading = false;
    this.userInfo = userInfo;
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
  }
}
