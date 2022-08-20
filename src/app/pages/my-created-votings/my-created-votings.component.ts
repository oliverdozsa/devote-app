import { Component, OnInit } from '@angular/core';
import {NbDialogService} from "@nebular/theme";
import {CreateVotingComponent} from "../../components/create-voting/create-voting.component";

@Component({
  selector: 'app-my-created-votings',
  templateUrl: './my-created-votings.component.html',
  styleUrls: ['./my-created-votings.component.scss']
})
export class MyCreatedVotingsComponent implements OnInit {

  constructor(private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }

  onCreateVotingClicked() {
    this.dialogService.open(CreateVotingComponent, {
      closeOnBackdropClick: false
    });
  }

}
