import {AccountValidator} from "./account/account-validator";
import {AccountPublicKeyDerivation} from "./account/account-public-key-derivation";
import {AccountBalanceQuery} from "./account/account-balance";

export class CreateVotingForm {
  private accountValidator: AccountValidator = new AccountValidator();
  private accountPublicDerivation: AccountPublicKeyDerivation = new AccountPublicKeyDerivation();
  accountBalance: AccountBalanceQuery = new AccountBalanceQuery();

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
    this.accountBalance.network = value;
  }

  private _selectedNetwork = "";

  get fundingAccountPublic(): string {
    return this._fundingAccountPublic;
  }

  set fundingAccountPublic(value: string) {
    this._fundingAccountPublic = value;
    this.accountValidator.accountPublic = value;
    this.accountBalance.accountPublic = value;
    this.queryBalanceIfNeeded();
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
    return this.selectedNetwork != "" && this.isFundingAccountSecretValid && this.isFundingAccountPublicValid;
  }

  get isFundingAccountPublicValid() {
    return this.accountValidator.isPublicValid();
  }

  get isFundingAccountSecretValid() {
    return this.accountValidator.isSecretValid();
  }

  get shouldUseTestNet() {
    return this._shouldUseTestNet;
  }

  set shouldUseTestNet(value: boolean) {
    this._shouldUseTestNet = value;
    this.accountBalance.shouldUseTestNet = value;
    this.queryBalanceIfNeeded();
  }

  private _shouldUseTestNet = true;

  private derivePublicFromSecretIfPossible() {
    if (this.shouldAccountPublicToBeDeterminedAutomatically) {
      if (this.isFundingAccountSecretValid) {
        this.fundingAccountPublic = this.accountPublicDerivation.derivePublicFrom(this.fundingAccountSecret);
      } else {
        this.fundingAccountPublic = "";
      }
    }
  }

  private queryBalanceIfNeeded() {
    if(this.isFundingAccountPublicValid) {
      this.accountBalance.query();
    }
  }
}
