import {Voting} from "../../../services/voting";
import {KeyPair} from "../../../components/create-voting/account/key-pair";
import {Keypair} from "stellar-sdk";
import {CastVoteInitResponse, CastVoteService} from "../../../services/cast-vote.service";
import {Observable} from "rxjs";

export class CastVoteOperations {
  constructor(private voting: Voting, private castVoteService: CastVoteService) {
  }

  createAccount(): KeyPair {
    if (this.voting.network == "stellar") {
      return StellarCastVoteOperations.createAccount();
    }

    return {
      publicKey: "<NOT SET>",
      secretKey: "<NOT SET>"
    }
  }
}

class StellarCastVoteOperations {
  static createAccount(): KeyPair {
    const keyPair = Keypair.random();

    return {
      publicKey: keyPair.publicKey(),
      secretKey: keyPair.secret()
    }
  }
}
