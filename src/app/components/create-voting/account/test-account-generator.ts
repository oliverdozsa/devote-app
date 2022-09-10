import {Keypair} from "stellar-sdk";
import {finalize, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface KeyPair {
  publicKey: string;
  secretKey: string;
}

export class TestAccountGenerator {
  isLoading = false;

  constructor(public network = "", private httpClient: HttpClient) {
  }

  generate(): Observable<KeyPair> {
    this.isLoading = true;

    let result: Observable<KeyPair> = of({publicKey: "", secretKey: ""});

    if (this.network == "stellar") {
      result = StellarGenerateTestAccount.generate(this.httpClient);
    }

    return result
      .pipe(
        finalize(() => this.isLoading = false)
      );
  }
}

class StellarGenerateTestAccount {
  static generate(httpClient: HttpClient): Observable<KeyPair> {
    const stellarKeyPair = Keypair.random();
    const appKeyPair = {
      publicKey: stellarKeyPair.publicKey(),
      secretKey: stellarKeyPair.secret()
    };

    return httpClient.get(`https://friendbot.stellar.org/?addr=${stellarKeyPair.publicKey()}`)
      .pipe(
        map(() => appKeyPair)
      );
  }
}
