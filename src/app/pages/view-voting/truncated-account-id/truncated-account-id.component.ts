import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-truncated-account-id',
  templateUrl: './truncated-account-id.component.html',
  styleUrls: ['./truncated-account-id.component.scss']
})
export class TruncatedAccountIdComponent {
  @Input()
  accountId: string | undefined = undefined;

  @Input()
  title: string = "";

  constructor() { }

  get truncatedOrUnavailable(): string {
    if(this.accountId) {
      return this.accountId.length > 10 ? this.accountId.slice(0, 10) + "..." : this.accountId;
    }

    return "<NOT AVAILABLE YET>";
  }

}
