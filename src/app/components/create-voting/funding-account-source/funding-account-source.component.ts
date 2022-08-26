import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-funding-account-source',
  templateUrl: './funding-account-source.component.html',
  styleUrls: ['./funding-account-source.component.scss']
})
export class FundingAccountSourceComponent implements OnInit {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() { }

  ngOnInit(): void {
  }

}
