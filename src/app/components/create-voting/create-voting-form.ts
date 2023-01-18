import {AccountValidator} from "./account/account-validator";
import {AccountPublicKeyDerivation} from "./account/account-public-key-derivation";
import {AccountBalanceQuery} from "./account/account-balance";
import {environment} from "../../../environments/environment";
import {AccountVotesCap} from "./account/account-votes-cap";

export enum Authorization {
  EMAILS = "EMAILS"
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  UNLISTED = "UNLISTED",
  PRIVATE = "PRIVATE"
}

export class CreateVotingForm {
  title: string = "";
  tokenIdentifier: string | undefined = undefined;
  visibility: Visibility = Visibility.PRIVATE;

  authorization: Authorization = Authorization.EMAILS;
  authorizationEmails: Set<string> = new Set<string>();

  isEncrypted: boolean = false;
  encryptedUntil: Date = new Date();

  startDate: Date = new Date();
  endDate: Date = new Date();

  isGeneratingFundingAccount: boolean = false;
  accountBalance: AccountBalanceQuery = new AccountBalanceQuery();
  accountVotesCap: AccountVotesCap = new AccountVotesCap();

  questions: VotingQuestion[] = [];

  isInvitesBased: boolean = false;
  organizerIfInvitesBased: string = "";

  private accountValidator: AccountValidator = new AccountValidator();
  private accountPublicDerivation: AccountPublicKeyDerivation = new AccountPublicKeyDerivation();

  private tokenIdentifierRegExp = new RegExp("^[0-9a-z]+$");

  get shouldAccountPublicToBeDeterminedAutomatically() {
    return this.selectedNetwork == "stellar";
  };

  get selectedNetwork(): string {
    return this._selectedNetwork;
  }

  set selectedNetwork(value: string) {
    this._selectedNetwork = value;
    this.accountValidator.network = value;
    this.accountPublicDerivation.network = value;
    this.accountBalance.network = value;
    this.accountVotesCap.network = value;
  }

  private _selectedNetwork = "";

  get fundingAccountPublic(): string {
    return this._fundingAccountPublic;
  }

  set fundingAccountPublic(value: string) {
    this._fundingAccountPublic = value;
    this.accountValidator.accountPublic = value;
    this.accountBalance.accountPublic = value;
    this.queryBalanceIfNeeded();
  }

  private _fundingAccountPublic = "";

  get fundingAccountSecret(): string {
    return this._fundingAccountSecret;
  }

  set fundingAccountSecret(value: string) {
    this._fundingAccountSecret = value;
    this.accountValidator.accountSecret = value;
    this.derivePublicFromSecretIfPossible();
  }

  private _fundingAccountSecret = "";

  get isFundingAccountPublicValid() {
    return this.accountValidator.isPublicValid();
  }

  get isFundingAccountSecretValid() {
    return this.accountValidator.isSecretValid();
  }

  get shouldUseTestNet() {
    return this._shouldUseTestNet;
  }

  set shouldUseTestNet(value: boolean) {
    this._shouldUseTestNet = value;
    this.accountBalance.shouldUseTestNet = value;
    this.queryBalanceIfNeeded();
  }

  private _shouldUseTestNet = true;

  get votesCap(): number | undefined {
    return this._votesCap;
  }

  set votesCap(value: number | undefined) {
    this._votesCap = value;
  }

  private _votesCap: number | undefined;

  get isVotesCapValid(): boolean {
    const maxPossibleVotesCapWithBalance = this.accountVotesCap.calculateMaxPossibleVotesCap()

    return this.votesCap != undefined && this.votesCap <= environment.maxVotesCap && this.votesCap > 1 &&
      maxPossibleVotesCapWithBalance >= this.votesCap;
  }

  get isTitleValid(): boolean {
    return this.title.length > 1 && this.title.length < 1000;
  }

  get isTokenIdentifierValid(): boolean {
    return this.tokenIdentifier == undefined || this.tokenIdentifier.length == 0 ||
      (this.tokenIdentifierRegExp.test(this.tokenIdentifier) && this.tokenIdentifier.length >= 2 &&
        this.tokenIdentifier.length <= 8);
  }

  get isAuthorizationInputValid(): boolean {
    if (this.authorization == Authorization.EMAILS) {
      return this.authorizationEmails.size > 0;
    }

    return false;
  }

  get isEncryptedUntilValid(): boolean {
    const hoursUntilEncrypted = (this.encryptedUntil.valueOf() - Date.now()) / (1000 * 60 * 60);
    return !this.isEncrypted || (this.isEncrypted && hoursUntilEncrypted >= 2)
  }

  get isStartDateValid(): boolean {
    return this.startDate.valueOf() < this.endDate.valueOf()
  }

  get isEndDateValid(): boolean {
    const hoursUntilEndDateFromNow = (this.endDate.valueOf() - Date.now()) / (1000 * 60 * 60);
    const isEndDateAfterStartDate = this.endDate.valueOf() > this.startDate.valueOf();
    const hoursBetweenStartAndEnd = (this.endDate.valueOf() - this.startDate.valueOf()) / (1000 * 60 * 60);

    return isEndDateAfterStartDate && hoursUntilEndDateFromNow >= 2 && hoursBetweenStartAndEnd >= 2;
  }

  get areQuestionsValid(): boolean {
    return this.questions.length > 0 && this.questions.every(q => q.isValid);
  }

  get isOrganizerValid(): boolean {
    return !this.isInvitesBased || this.organizerIfInvitesBased.length > 0;
  }

  private derivePublicFromSecretIfPossible() {
    if (this.shouldAccountPublicToBeDeterminedAutomatically) {
      if (this.isFundingAccountSecretValid) {
        this.fundingAccountPublic = this.accountPublicDerivation.derivePublicFrom(this.fundingAccountSecret);
      } else {
        this.fundingAccountPublic = "";
      }
    }
  }

  private queryBalanceIfNeeded() {
    if (this.isFundingAccountPublicValid) {
      this.accountBalance.query()
        .then(
          b => {
            this.accountVotesCap.balance = b;
          },
          () => {
            this.accountBalance.value = -1;
            this.accountVotesCap.balance = -1;
          }
        );
    } else {
      this.accountBalance.value = -1;
      this.accountVotesCap.balance = -1;
    }
  }
}

export class VotingQuestion {
  options: string[] = [];
  question: string = "";

  get isQuestionValid(): boolean {
    return this.question.length > 1 && this.question.length < 1000
  }

  get isOptionsLengthValid(): boolean {
    return this.options.length > 1;
  }

  get isValid(): boolean {
    return this.areAllOptionsValid() && this.isQuestionValid && this.isOptionsLengthValid;
  }


  isOptionValidAt(i: number) {
    return this.isOptionValid(this.options[i]);
  }

  isOptionValid(option: string): boolean {
    return option.length > 1 && option.length < 1000;
  }

  areAllOptionsValid() {
    return this.options
      .map(o => this.isOptionValid(o))
      .reduce((prev, current) => prev && current, true);
  }

  deleteAt(i: number) {
    this.options.splice(i, 1);
  }

  addNewEmptyOption() {
    this.options.push("");
  }
}
