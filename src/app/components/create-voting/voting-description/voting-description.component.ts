import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-voting-description',
  templateUrl: './voting-description.component.html',
  styleUrls: ['./voting-description.component.scss']
})
export class VotingDescriptionComponent implements OnInit {
  @Input()
  maxLength = 1000;

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor() { }

  ngOnInit(): void {
  }

}
