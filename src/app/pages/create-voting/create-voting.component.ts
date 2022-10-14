import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {NbAuthService} from "@nebular/auth";
import {NbStepperComponent} from "@nebular/theme";
import {CreateVotingForm} from "../../components/create-voting/create-voting-form";

enum Step {
  SELECT_NETWORK,
  SET_FUNDING_ACCOUNT,
  VOTING_BASIC_DATA,
  QUESTIONS
}

@Component({
  selector: 'app-create-voting',
  templateUrl: './create-voting.component.html',
  styleUrls: ['./create-voting.component.scss']
})
export class CreateVotingComponent implements OnDestroy {
  isUnlocked = false;

  form: CreateVotingForm = new CreateVotingForm();
  currentStep: Step = Step.SELECT_NETWORK;

  isCreatingInProgress: boolean = false;

  destroy$ = new Subject<void>();

  get isDisallowedToGoToNextStep(): boolean {
    if (this.currentStep == Step.SELECT_NETWORK) {
      return this.form.selectedNetwork == ""
    } else if (this.currentStep == Step.SET_FUNDING_ACCOUNT) {
      return this.form.accountBalance.value < 1;
    } else if (this.currentStep == Step.VOTING_BASIC_DATA) {
      return !this.form.isVotesCapValid || !this.form.isAuthorizationInputValid || !this.form.isTitleValid ||
        !this.form.isEncryptedUntilValid || !this.form.isStartDateValid || !this.form.isEndDateValid;
    }

    return true;
  }

  get shouldGoToPrevStepBeDisplayed() {
    return this.currentStep != Step.SELECT_NETWORK;
  }

  get shouldGoToNextStepBeDisplayed() {
    return this.currentStep != Step.QUESTIONS;
  }

  get isLoading(): boolean {
    return this.form.isGeneratingFundingAccount || this.form.accountBalance.isLoading || this.isCreatingInProgress;
  }

  get isDisallowedToCreate(): boolean {
    return !this.form.areQuestionsValid;
  }

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
    this.currentStep += 1;
    stepper.next();
  }

  onCreateClicked() {
    // TODO
  }

  onPrevClicked(stepper: NbStepperComponent) {
    this.currentStep -= 1;
    const prevStep = stepper.selected;

    stepper.previous();
    prevStep.reset();
  }

  private onIsAuthenticated(isAuthenticated: boolean) {
    this.isUnlocked = isAuthenticated;
  }
}
