import {OrchestrationStep} from "./orchestration-step";
import {CastVoteOrchestration, ProgressState} from "../cast-vote-orchestration";
import {Progress} from "../progress";
import {CastVoteOperations} from "../cast-vote-operations";
import {Buffer} from "buffer";
import {BigInteger} from "jsbn";
import {Voting} from "../../../../services/voting";
import {CastVoteService, CastVoteSignEnvelopeResponse} from "../../../../services/cast-vote.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NbToastrService} from "@nebular/theme";
import {delay} from "rxjs";

const BlindSignature = require("blind-signatures");
const NodeRSA = require("node-rsa");

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
    this.progress.state = ProgressState.SigningEnvelope;
    this.progress.account = this.operations.createAccount();

    const result = this.produceResult();
    this.progress.concealingFactor = SignEnvelopeStep.bigIntToBase64Str(result.concealed.r);
    this.progress.message = result.message;

    const concealedMessageBase64Str = SignEnvelopeStep.bigIntToBase64Str(result.concealed.blinded);
    this.service.signEnvelope(this.voting.id, concealedMessageBase64Str)
      .pipe(delay(1500))
      .subscribe({
        next: r => this.onSignEnvelopeSuccess(r),
        error: e => this.onSignEnvelopeError(e)
      });
  }

  override complete() {
    this.progress.state = ProgressState.SignedEnvelope;
    super.complete();
  }

  private produceResult() {
    const publicKey = new NodeRSA(this.progress.publicKeyForEnvelope!)

    const message = `${this.voting.id}|${this.progress.account!.publicKey}`;
    const concealed = BlindSignature.blind(
      {
        message: message,
        N: publicKey.keyPair.n.toString(),
        E: publicKey.keyPair.e.toString()
      }
    );

    return {message: message, concealed: concealed};
  }

  private onSignEnvelopeSuccess(response: CastVoteSignEnvelopeResponse) {
    const signatureOnConcealedMessage = SignEnvelopeStep.bigIntFromBase64Str(response.envelopeSignatureBase64);

    const publicKey = new NodeRSA(this.progress.publicKeyForEnvelope!)

    const concealingFactor = SignEnvelopeStep.bigIntFromBase64Str(this.progress.concealingFactor!);

    const signatureOnRevealedMessage = BlindSignature.unblind({
      signed: signatureOnConcealedMessage,
      N: publicKey.keyPair.n,
      r: concealingFactor
    });

    this.progress.revealedSignature = SignEnvelopeStep.bigIntToBase64Str(signatureOnRevealedMessage);

    this.complete();
  }

  private onSignEnvelopeError(error: HttpErrorResponse) {
    if (error.status == 403) {
      this.service.getEnvelopeSignature(this.voting.id)
        .pipe(delay(1500))
        .subscribe({
          next: r => this.onSignEnvelopeSuccess(r),
          error: e => this.toastr.danger("Failed to cast vote! Try again maybe. (error getting envelope signature)")
        });
    } else {
      this.toastr.danger("Failed to cast vote! Try again maybe. (error signing envelope)");
    }
  }

  private static bigIntToBase64Str(bigint: BigInteger) {
    const bigIntAsBytes = bigint.toByteArray();
    return Buffer.from(bigIntAsBytes).toString("base64");
  }

  private static bigIntFromBase64Str(base64Str: string) {
    const buffer = Buffer.from(base64Str, "base64");
    const bufferHexStr = buffer.toString("hex");
    return new BigInteger(bufferHexStr, 16);
  }
}