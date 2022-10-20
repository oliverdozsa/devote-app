export class VotingResponse {
  public id: string = "";
  public network: string = "";
  public title: string = "";
  public votesCap: number = -1;
  public polls: PollResponse[] = [];
  public createdAt: string = "";
  public encryptedUntil: string = "";
  public decryptionKey: string = "";
  public startDate: string = "";
  public endDate: string = "";
  public distributionAccountId: string = "";
  public ballotAccountId: string = "";
  public issuerAccountId: string = "";
  public assetCode: string = "";
  public authorization: string = "";
  public visibility: string = "";

}

export class PollResponse {
  public index: number = -1;
  public question: string = "";
  public pollOptions: PollOption[] = [];
}

export class PollOption {
  public name: string = "";
  public code: number = -1;
}
