import {CreateVotingForm} from "../components/create-voting/create-voting-form";

export class CreateVotingRequest {
  public network: string = "";
  public votesCap: number = 0;
  public title: string = "";
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
    request.encryptedUntil = form.isEncrypted ? form.encryptedUntil.toISOString() : undefined;
    request.startDate = form.startDate.toISOString();
    request.endDate = form.endDate.toISOString();
    request.authorization = form.authorization;
    request.authorizationEmailOptions =
      form.authorizationEmails.size > 0 ? Array.from(form.authorizationEmails) : undefined;


    // TODO

    return request;
  }
}


export class CreatePollRequest {
  public question: string = "";
  public options: CreatePollOptionRequest[] = [];
}

export class CreatePollOptionRequest {
  public name: string = "";
  public code: number = 0;
}
