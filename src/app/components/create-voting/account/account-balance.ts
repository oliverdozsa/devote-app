import {StellarServers} from "../../../blockchains/StellarServers";
import {Horizon} from "stellar-sdk";

export class AccountBalanceQuery {
  isLoading = false;
  isNotFound = false;
  value: number = -1.0;

  constructor(public network: string = "", public shouldUseTestNet: boolean = true, public accountPublic: string = "") {
  }

  query() {
    let balancePromise = Promise.resolve(-1.0);
    this.isLoading = true;
    this.isNotFound = false;

    if(this.network == "stellar") {
      balancePromise = StellarAccountBalance.queryBalanceOf(this.accountPublic, this.shouldUseTestNet);
    }

    balancePromise.then(
      b => {
        this.isLoading = false;
        this.value = b;
      },
      e => {
        this.isLoading = false;
        if(e.message == "Not Found") {
          this.isNotFound = true;
        } else {
          throw e;
        }
      }
    )
  }

  get currency(): string {
    if(this.isNotFound) {
      return "";
    }

    if(this.network == "stellar") {
      return "XLM"
    }

    return "unknown";
  }
}

class StellarAccountBalance{
  static queryBalanceOf(accountPublic: string, isOnTestNetwork: boolean): Promise<number> {
    const server = StellarServers.getServer(isOnTestNetwork);
    return server.accounts().accountId(accountPublic)
      .call()
      .then(r => StellarAccountBalance.findXlmBalance(r.balances));
  }

  private static findXlmBalance(balances: Horizon.BalanceLine[]): number {
    const xlmBalance = balances.find(b => b.asset_type == "native")
    return Number.parseFloat(xlmBalance!.balance);
  }
}
