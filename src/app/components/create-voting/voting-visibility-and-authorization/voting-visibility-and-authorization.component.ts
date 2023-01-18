import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm, Visibility} from "../create-voting-form";

@Component({
  selector: 'app-voting-visibility-and-authorization',
  templateUrl: './voting-visibility-and-authorization.component.html',
  styleUrls: ['./voting-visibility-and-authorization.component.scss']
})
export class VotingVisibilityAndAuthorizationComponent {
  Visibility = Visibility;

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() { }
}
