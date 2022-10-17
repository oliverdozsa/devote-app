import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbAuthService} from "@nebular/auth";
import {Subject, takeUntil} from "rxjs";
import {AppRoutes} from "../../../app-routes";
import {Router} from "@angular/router";
import {PagingSource} from "../../services/votings.service";

@Component({
  selector: 'app-my-created-votings',
  templateUrl: './my-created-votings.component.html',
  styleUrls: ['./my-created-votings.component.scss']
})
export class MyCreatedVotingsComponent implements OnDestroy {
  source = PagingSource.VOTE_CALLER;
  isUnlocked = false;

  destroy$ = new Subject<void>();

  constructor(private router: Router, private authService: NbAuthService) {
    authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: a => this.onIsAuthenticated(a)
      });

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.MY_CREATED_VOTING}`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreateVotingClicked() {
    this.router.navigateByUrl(`/${AppRoutes.CREATE_VOTING}`);
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
  }
}
