import {Keypair} from "stellar-sdk";


export class AccountValidator {
  constructor(public network: string = "", public accountPublic: string = "", public accountSecret: string = "") {
  }

  isPublicValid(): boolean {
    return this.validateAccount != undefined && this.validateAccount.isPublicValid();
  }

  isSecretValid(): boolean {
    return this.validateAccount != undefined && this.validateAccount.isSecretValid();
  }

  private get validateAccount(): ValidateAccount | undefined {
    if(this.network == "stellar") {
      return new StellarValidateAccount(this.accountPublic, this.accountSecret);
    }

    return undefined;
  }
}

interface ValidateAccount {
  isPublicValid(): boolean;

  isSecretValid(): boolean;
}

class StellarValidateAccount implements ValidateAccount {
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
