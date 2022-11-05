import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {NbAuthService} from "@nebular/auth";
import {AppRoutes} from "../../../app-routes";
import {PagingSource} from "../../services/votings.service";

@Component({
  selector: 'app-votings-where-i-participate',
  templateUrl: './votings-where-i-participate.component.html',
  styleUrls: ['./votings-where-i-participate.component.scss']
})
export class VotingsWhereIParticipateComponent implements OnDestroy{
  source = PagingSource.VOTER;

  isUnlocked = false;

  destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService) {
    authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: a => this.onIsAuthenticated(a)
      });

    localStorage.setItem("lastVisitedPage", `/${AppRoutes.VOTINGS_WHERE_I_PARTICIPATE}`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
  }
}
