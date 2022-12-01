import {Component, Input, OnInit} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";
import {NbToastrService} from "@nebular/theme";
import {HttpClient} from "@angular/common/http";
import {TestAccountGenerator} from "../account/test-account-generator";
import {finalize} from "rxjs";
import {KeyPair} from "../account/key-pair";

@Component({
  selector: 'app-funding-account-source',
  templateUrl: './funding-account-source.component.html',
  styleUrls: ['./funding-account-source.component.scss']
})
export class FundingAccountSourceComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  private testAccountGenerator: TestAccountGenerator;

  constructor(private toastr: NbToastrService, httpClient: HttpClient) {
    this.testAccountGenerator = new TestAccountGenerator("", httpClient)
  }

  onGenerateFundingAccountClicked() {
    this.testAccountGenerator.network = this.form.selectedNetwork;

    this.form.isGeneratingFundingAccount = true;
    this.testAccountGenerator.generate()
      .pipe(
        finalize(() => this.form.isGeneratingFundingAccount = false)
      )
      .subscribe({
        next: k => this.onTestAccountGenerated(k),
        error: e => this.onTestAccountGenerationFailed(e)
      });
  }

  private onTestAccountGenerated(keyPair: KeyPair) {
    this.form.fundingAccountPublic = keyPair.publicKey;
    this.form.fundingAccountSecret = keyPair.secretKey;
  }

  private onTestAccountGenerationFailed(e: any) {
    console.warn(`Failed to generate test account:${JSON.stringify(e)}`);
    this.toastr.danger("Failed to generate funding account! Maybe try again later.")
  }
}
