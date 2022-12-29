import {Voting} from "../../../services/voting";

export function getAccountLink(network: string, isOnTestNet: boolean, accountId: string) {
  if(network == "stellar") {
    return `https://${isOnTestNet ?  "testnet." : ""}lumenscan.io/account/${accountId}`;
  }

  return "<UNKNOWN NETWORK WHEN GETTING TRANSACTION LINK>";


}
