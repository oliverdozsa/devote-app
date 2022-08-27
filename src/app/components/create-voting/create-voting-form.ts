import {AccountValidator} from "./account/account-validator";
import {AccountPublicKeyDerivation} from "./account/account-public-key-derivation";

export class CreateVotingForm {
  shouldUseTestNet = true;

  private accountValidator: AccountValidator = new AccountValidator();
  private accountPublicDerivation: AccountPublicKeyDerivation = new AccountPublicKeyDerivation();

  get shouldAccountPublicToBeDeterminedAutomatically() {
    return this.selectedNetwork == "stellar";
  };

  get selectedNetwork(): string {
    return this._selectedNetwork;
  }

  set selectedNetwork(value: string) {
    this._selectedNetwork = value;
    this.accountValidator.network = value;
    this.accountPublicDerivation.network = value;
  }

  private _selectedNetwork = "";

  get fundingAccountPublic(): string {
    return this._fundingAccountPublic;
  }

  set fundingAccountPublic(value: string) {
    this._fundingAccountPublic = value;
    this.accountValidator.accountPublic = value;
  }

  private _fundingAccountPublic = "";

  get fundingAccountSecret(): string {
    return this._fundingAccountSecret;
  }

  set fundingAccountSecret(value: string) {
    this._fundingAccountSecret = value;
    this.accountValidator.accountSecret = value;
    this.derivePublicFromSecretIfPossible();
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

  private derivePublicFromSecretIfPossible() {
    if (this.shouldAccountPublicToBeDeterminedAutomatically) {
      if (this.isFundingAccountSecretValid) {
        this.fundingAccountPublic = this.accountPublicDerivation.derivePublicFrom(this.fundingAccountSecret);
      } else {
        this.fundingAccountPublic = "";
      }
    }
  }
}
