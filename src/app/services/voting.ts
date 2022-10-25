export class Voting {
  public id: string = "";
  public network: string = "";
  public title: string = "";
  public votesCap: number = -1;
  public polls: Poll[] = [];
  public createdAt: string = "";
  public encryptedUntil: string = "";
  public decryptionKey: string = "";
  public startDate: string = "";
  public endDate: string = "";
  public distributionAccountId: string | undefined = undefined;
  public ballotAccountId: string | undefined = undefined;
  public issuerAccountId: string | undefined = undefined;
  public assetCode: string = "";
  public authorization: string = "";
  public visibility: string = "";

}

export class Poll {
  public index: number = -1;
  public question: string = "";
  public pollOptions: PollOption[] = [];
}

export class PollOption {
  public name: string = "";
  public code: number = -1;
}
