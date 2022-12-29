import {Voting} from "../../services/voting";

export function getTransactionLink(voting: Voting, transaction: string) {
  if(voting.network == "stellar") {
    return `https://${voting.isOnTestNetwork ?  "testnet." : ""}lumenscan.io/txns/${transaction}`;
  }

  return "<UNKNOWN NETWORK WHEN GETTING TX LINK>";
}
