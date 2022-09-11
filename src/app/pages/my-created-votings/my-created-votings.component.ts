import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbDialogService} from "@nebular/theme";
import {CreateVotingComponent} from "../../components/create-voting/create-voting.component";
import {NbAuthService} from "@nebular/auth";
import {Subject, takeUntil} from "rxjs";
import {AppRoutes} from "../../../app-routes";

@Component({
  selector: 'app-my-created-votings',
  templateUrl: './my-created-votings.component.html',
  styleUrls: ['./my-created-votings.component.scss']
})
export class MyCreatedVotingsComponent implements OnDestroy {
  isUnlocked = false;

  destroy$ = new Subject<void>();

  constructor(private dialogService: NbDialogService, private authService: NbAuthService) {
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
    this.dialogService.open(CreateVotingComponent, {
      closeOnBackdropClick: false
    });
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
  }
}
