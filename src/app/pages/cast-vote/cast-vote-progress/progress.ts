import {KeyPair} from "../../../components/create-voting/account/key-pair";
import {ProgressState} from "./cast-vote-orchestration";

export class Progress {
  state: ProgressState = ProgressState.PreInit
  account: KeyPair | undefined;
  publicKeyForEnvelope: string | undefined;
  message: string | undefined;
  concealingFactor: string | undefined;
  revealedSignature: string | undefined;
  blockchainTransaction: string | undefined;
  selectedOptions: any[] = [];
}
