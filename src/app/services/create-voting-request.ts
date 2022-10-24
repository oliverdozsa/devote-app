import {CreateVotingForm, Visibility, VotingQuestion} from "../components/create-voting/create-voting-form";

export class CreateVotingRequest {
  public network: string = "";
  public votesCap: number = 0;
  public title: string = "";
  public tokenIdentifier: string |undefined = undefined;
  public encryptedUntil: string | undefined = undefined;
  public startDate: string = "";
  public endDate: string = "";
  public authorization: string = "";
  public authorizationEmailOptions: string[] | undefined = undefined;
  public polls: CreatePollRequest[] = [];
  public visibility: string = "";
  public fundingAccountPublic: string = "";
  public fundingAccountSecret: string = "";
  public useTestnet: boolean = false;

  static fromCreateVotingForm(form: CreateVotingForm): CreateVotingRequest {
    const request = new CreateVotingRequest();

    request.network = form.selectedNetwork;
    request.votesCap = form.votesCap!;
    request.title = form.title;
    request.tokenIdentifier = form.tokenIdentifier ? form.tokenIdentifier : undefined;
    request.encryptedUntil = form.isEncrypted ? form.encryptedUntil.toISOString() : undefined;
    request.startDate = form.startDate.toISOString();
    request.endDate = form.endDate.toISOString();
    request.authorization = form.authorization;
    request.authorizationEmailOptions =
      form.authorizationEmails.size > 0 ? Array.from(form.authorizationEmails) : undefined;
    request.polls = form.questions.map(q => CreatePollRequest.fromVotingQuestion(q));
    request.visibility = Visibility[form.visibility];
    request.fundingAccountPublic = form.fundingAccountPublic;
    request.fundingAccountSecret = form.fundingAccountSecret;
    request.useTestnet = form.shouldUseTestNet;

    return request;
  }
}


export class CreatePollRequest {
  public question: string = "";
  public options: CreatePollOptionRequest[] = [];

  static fromVotingQuestion(question: VotingQuestion): CreatePollRequest {
    const request = new CreatePollRequest();

    request.question = question.question;
    request.options = question.options.map((o, i) => new CreatePollOptionRequest(o, i + 1));

    return request;
  }
}

export class CreatePollOptionRequest {
  public name: string = "";
  public code: number = 0;


  constructor(name: string, code: number) {
    this.name = name;
    this.code = code;
  }
}
