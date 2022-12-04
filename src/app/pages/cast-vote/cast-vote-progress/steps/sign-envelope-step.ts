import {OrchestrationStep} from "./orchestration-step";
import {CastVoteOrchestration} from "../cast-vote-orchestration";
import {Progress} from "../progress";
import NodeRSA from "node-rsa";
import {CastVoteOperations} from "../cast-vote-operations";
import {KeyPair} from "../../../../components/create-voting/account/key-pair";
import {Buffer} from "buffer";
import {BigInteger} from "jsbn";
import {Voting} from "../../../../services/voting";
import {CastVoteService, CastVoteSignEnvelopeResponse} from "../../../../services/cast-vote.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NbToastrService} from "@nebular/theme";

const BlindSignature = require("blind-signatures");

export class SignEnvelopeStep extends OrchestrationStep {
  private progress: Progress;
  private operations: CastVoteOperations;
  private voting: Voting;
  private service: CastVoteService;
  private toastr: NbToastrService;

  constructor(orchestration: CastVoteOrchestration) {
    super(orchestration);

    this.progress = orchestration.progress;
    this.operations = orchestration.operations;
    this.voting = orchestration.voting;
    this.service = orchestration.castVoteService;
    this.toastr = orchestration.toastr;
  }

  execute(): void {
    this.progress.account = this.operations.createAccount();

    const publicKey = new NodeRSA(this.progress.publicKeyForEnvelope!)
    const publicKeyComponents = publicKey.exportKey('components-public');
    const concealingResult = BlindSignature.blind(
      {
        message: `${this.voting.id}|${this.progress.account.publicKey}`,
        N: publicKeyComponents.n.toString(),
        E: publicKeyComponents.e.toString()
      }
    );

    this.progress.concealingFactor = SignEnvelopeStep.bigIntToBase64(concealingResult.r);

    const concealedMessageBase64Str = SignEnvelopeStep.bigIntToBase64(concealingResult.blinded);
    this.service.signEnvelope(this.voting.id, concealedMessageBase64Str)
      .subscribe({
        next: r => this.onSignEnvelopeSuccess(r),
        error: e => this.onSignEnvelopeError(e)
      });
  }

  private static bigIntToBase64(bigint: BigInteger) {
    const bigIntAsBytes = bigint.toByteArray();
    return Buffer.from(bigIntAsBytes).toString("base64");
  }

  private onSignEnvelopeSuccess(response: CastVoteSignEnvelopeResponse) {
    // TODO
  }

  private onSignEnvelopeError(error: HttpErrorResponse) {
    if (error.status == 403) {
      // TODO: call get envelope signature API.
    }

    this.toastr.danger("Unknown status error during init!");
  }
}
