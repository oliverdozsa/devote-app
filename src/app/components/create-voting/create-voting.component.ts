import { Component, OnInit } from '@angular/core';
import {NbDialogRef, NbToastrService} from "@nebular/theme";
import {CreateVotingForm} from "./create-voting-form";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-create-voting',
  templateUrl: './create-voting.component.html',
  styleUrls: ['./create-voting.component.scss']
})
export class CreateVotingComponent {
  form: CreateVotingForm;

  get isLoading(): boolean{
    return this.form && (this.form.accountBalance.isLoading || this.form.isGeneratingFundingAccount);
  }

  constructor(protected dialogRef: NbDialogRef<any>) {
    this.form = new CreateVotingForm();
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
