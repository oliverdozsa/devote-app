import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";
import {NbTagComponent, NbTagInputAddEvent} from "@nebular/theme";

@Component({
  selector: 'app-voting-authorization-emails',
  templateUrl: './voting-authorization-emails.component.html',
  styleUrls: ['./voting-authorization-emails.component.scss']
})
export class VotingAuthorizationEmailsComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  userInput: string = "";

  private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor() { }

  onEmailRemove(tag: NbTagComponent) {
    this.form.authorizationEmails.delete(tag.text);
  }

  onEmailAdd({value, input}: NbTagInputAddEvent) {
    if(this.isUserInputValid) {
      this.form.authorizationEmails.add(value);
      input.nativeElement.value = "";
    }
  }

  onEmailAddClick($event: any) {
      this.form.authorizationEmails.add($event.value);
      $event.input.value = "";
    this.userInput = "";
  }

  get isUserInputValid(): boolean {
    return (this.userInput == "" || this.userInput.match(this.emailPattern) != null);
  }

  get dangerTextEmailField(): string {
    if(!this.isUserInputValid) {
      return "Must enter a valid email address.";
    }

    if(!this.form.isAuthorizationInputValid) {
      return "Must have at least one email address added.";
    }

    return "";
  }

  get dangerTextOrganizerField(): string {
    if(!this.form.isOrganizerValid) {
      return "If casting voting is based on invites, the organizer must not be empty."
    }

    return "";
  }
}
