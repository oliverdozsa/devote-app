import {Component, Input, OnInit} from '@angular/core';
import {BallotType, CreateVotingForm} from "../create-voting-form";
import {MaxVotingQuestionsOrChoices} from "../account/max-voting-questions-or-choices";

@Component({
  selector: 'app-ballot-type',
  templateUrl: './ballot-type.component.html',
  styleUrls: ['./ballot-type.component.scss']
})
export class BallotTypeComponent {
  BallotType = BallotType;

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  private _maxPossible: MaxVotingQuestionsOrChoices = new MaxVotingQuestionsOrChoices();

  get maxPossible(): number {
    return this._maxPossible.determine(this.form);
  }

  constructor() { }
}
