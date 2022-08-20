import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'app-create-voting',
  templateUrl: './create-voting.component.html',
  styleUrls: ['./create-voting.component.scss']
})
export class CreateVotingComponent implements OnInit {
  constructor(protected dialogRef: NbDialogRef<any>) { }

  ngOnInit(): void {
  }

  onCancelClicked() {
    this.dialogRef.close();
  }

}
