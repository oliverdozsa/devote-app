import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {CreateVotingForm} from "./create-voting-form";

@Component({
  selector: 'app-create-voting',
  templateUrl: './create-voting.component.html',
  styleUrls: ['./create-voting.component.scss']
})
export class CreateVotingComponent implements OnInit {
  form = new CreateVotingForm();

  constructor(protected dialogRef: NbDialogRef<any>) { }

  ngOnInit(): void {
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
