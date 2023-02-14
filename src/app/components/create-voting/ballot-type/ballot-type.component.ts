import {Component, Input, OnInit} from '@angular/core';
import {BallotType, CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-ballot-type',
  templateUrl: './ballot-type.component.html',
  styleUrls: ['./ballot-type.component.scss']
})
export class BallotTypeComponent {
  BallotType = BallotType;

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() { }
}
