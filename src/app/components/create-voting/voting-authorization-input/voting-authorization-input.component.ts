import {Component, Input} from '@angular/core';
import {Authorization, CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-voting-authorization-input',
  templateUrl: './voting-authorization-input.component.html',
  styleUrls: ['./voting-authorization-input.component.scss']
})
export class VotingAuthorizationInputComponent {
  Authorization = Authorization;

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() { }

}
