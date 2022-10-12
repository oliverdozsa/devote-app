import {Component, Input} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-voting-questions',
  templateUrl: './voting-questions.component.html',
  styleUrls: ['./voting-questions.component.scss']
})
export class VotingQuestionsComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();


  constructor() { }

}
