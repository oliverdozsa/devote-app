import {Keypair} from "stellar-sdk";


export class AccountValidator {
  constructor(public network: string = "", public accountPublic: string = "", public accountSecret: string = "") {
  }

  isPublicValid(): boolean {
    if(this.network == "stellar") {
      return new StellarValidateAccount(this.accountPublic, this.accountSecret).isPublicValid();
    }

    return false;
  }

  isSecretValid(): boolean {
    if(this.network == "stellar") {
      return new StellarValidateAccount(this.accountPublic, this.accountSecret).isSecretValid();
    }

    return false;
  }
}

class StellarValidateAccount {
  constructor(private accountPublic: string, private accountSecret: string) {
  }

  isPublicValid(): boolean {
    try {
      Keypair.fromPublicKey(this.accountPublic);
    } catch (error) {
      return false;
    }

    return true;
  }

  isSecretValid(): boolean {
    try {
      Keypair.fromSecret(this.accountSecret);
    } catch (error) {
      return false;
    }

    return true;
  }
}
