import {AccountValidator} from "./account-validation/account-validator";

export class CreateVotingForm {
  shouldUseTestNet = true;

  private accountValidator: AccountValidator = new AccountValidator();

  get selectedNetwork(): string {
    return this._selectedNetwork;
  }

  set selectedNetwork(value: string) {
    this._selectedNetwork = value;
    this.reCreateAccountValidator();
  }

  private _selectedNetwork = "";

  get fundingAccountPublic(): string {
    return this._fundingAccountPublic;
  }

  set fundingAccountPublic(value: string) {
    this._fundingAccountPublic = value;
    this.reCreateAccountValidator();
  }

  private _fundingAccountPublic = "";

  get fundingAccountSecret(): string {
    return this._fundingAccountSecret;
  }

  set fundingAccountSecret(value: string) {
    this._fundingAccountSecret = value;
    this.reCreateAccountValidator();
  }

  private _fundingAccountSecret = "";

  get isValid() {
    return this.selectedNetwork != "";
  }

  get isFundingAccountPublicValid() {
    return this.accountValidator.isPublicValid();
  }

  get isFundingAccountSecretValid() {
    return this.accountValidator.isSecretValid();
  }

  private reCreateAccountValidator() {
    this.accountValidator = new AccountValidator(this.selectedNetwork, this.fundingAccountPublic, this.fundingAccountSecret);
  }
}
