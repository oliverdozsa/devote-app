import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";

@Component({
  selector: 'app-voting-title',
  templateUrl: './voting-title.component.html',
  styleUrls: ['./voting-title.component.scss']
})
export class VotingTitleComponent implements OnInit {
  @Input()
  form: CreateVotingForm = new CreateVotingForm()

  constructor() { }

  ngOnInit(): void {
  }

}
