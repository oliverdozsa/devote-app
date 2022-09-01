import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() { }
}
