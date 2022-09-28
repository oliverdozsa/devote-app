import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {NbAuthService} from "@nebular/auth";
import {NbStepperComponent} from "@nebular/theme";

@Component({
  selector: 'app-create-voting',
  templateUrl: './create-voting.component.html',
  styleUrls: ['./create-voting.component.scss']
})
export class CreateVotingComponent implements OnDestroy {
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
  }

  ngOnDestroy(): void {
  }

  onNextClicked(stepper: NbStepperComponent) {
    // TODO
    stepper.next();
  }

  onPrevClicked(stepper: NbStepperComponent) {
    // TODO
    stepper.previous();
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
  }

}
