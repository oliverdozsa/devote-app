import {Component, Input} from '@angular/core';
import {BallotType, CreateVotingForm, VotingQuestion} from "../create-voting-form";
import {MaxVotingQuestions} from "../account/max-voting-questions";

@Component({
  selector: 'app-voting-question',
  templateUrl: './voting-question.component.html',
  styleUrls: ['./voting-question.component.scss']
})
export class VotingQuestionComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  maxQuestions = new MaxVotingQuestions();

  get remainingNumberOfPossibleQuestions(): number {
    if (this.form.ballotType == BallotType.MULTI_CHOICE) {
      return 1;
    }

    return this.maxQuestions.determine(this.form) - this.form.questions.length;
  }

  getWarnMessageFor(i: number): string {
    if (!this.form.questions[i].isQuestionValid) {
      return "Question's length should be > 1 and < 1000.";
    }

    if (!this.form.questions[i].isOptionsLengthValid) {
      return "There must be at least 2 options."
    }

    if (!this.form.questions[i].areAllOptionsValid()) {
      return "Each option must have length > 1 and < 1000";
    }

    return "";
  }

  addOptionClickedAt(i: number) {
    this.form.questions[i].addNewEmptyOption();
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  deleteOptionClicked(i: number, j: number) {
    this.form.questions[i].deleteAt(j);
  }

  preventPropagationOf(event: any) {
    event.stopPropagation();
  }

  addQuestionClicked() {
    this.form.questions.push(new VotingQuestion());
  }

  deleteQuestionClicked(i: number) {
    this.form.questions.splice(i, 1);
  }
}
