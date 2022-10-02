import {Component, Input} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-voting-start-end-date',
  templateUrl: './voting-start-end-date.component.html',
  styleUrls: ['./voting-start-end-date.component.scss']
})
export class VotingStartEndDateComponent {

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() {
  }

}
