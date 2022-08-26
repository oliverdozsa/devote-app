import {Keypair} from "stellar-sdk";


export class AccountValidator {
  private validateAccount: ValidateAccount | undefined;

  constructor(private network: string = "", private accountPublic: string = "", private accountSecret: string = "") {
    if (network == "stellar") {
      this.validateAccount = new StellarValidateAccount(accountPublic, accountSecret);
    }
  }

  isPublicValid(): boolean {
    return this.validateAccount != undefined && this.validateAccount.isPublicValid();
  }

  isSecretValid(): boolean {
    return this.validateAccount != undefined && this.validateAccount.isSecretValid();
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
      new Keypair({type: "ed25519", secretKey: this.accountSecret, publicKey: this.accountPublic});
    } catch (error) {
      return false;
    }

    return true;
  }
}
