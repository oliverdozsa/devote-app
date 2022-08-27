import {Keypair} from "stellar-sdk";

export class AccountPublicKeyDerivation {
  constructor(public network: string = "") {
  }

  derivePublicFrom(secret: string): string {
    if (this.network == "stellar") {
      return StellarPublicKeyDerivation.derivePublicFrom(secret);
    }

    return "";
  }
}

class StellarPublicKeyDerivation {
  static derivePublicFrom(secret: string): string {
    return Keypair.fromSecret(secret).publicKey();
  }
}
