import {Component, Input, ViewChild} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";
import {NbPopoverDirective} from "@nebular/theme";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-votes-cap',
  templateUrl: './votes-cap.component.html',
  styleUrls: ['./votes-cap.component.scss']
})
export class VotesCapComponent {
  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  @ViewChild(NbPopoverDirective)
  popover!: NbPopoverDirective;

  get shouldWarn(): boolean {
    let shouldWarn = false;

    if(this.form.votesCap != undefined) {
      if(this.form.shouldUseTestNet) {
        shouldWarn = this.form.votesCap > environment.maxVotesCapTestNet;
      } else {
        shouldWarn = this.form.votesCap > environment.maxVotesCap;
      }
    }

    if(shouldWarn) {
      this.openPopover();
    } else {
      this.closePopover();
    }

    return shouldWarn;
  }

  get toolTipText() {
    if(this.form.shouldUseTestNet) {
      return `On test network the maximum number of votes is limited to ${environment.maxVotesCapTestNet.toLocaleString()}.`;
    }

    return `The maximum number of votes is limited to ${environment.maxVotesCap.toLocaleString()}.`;
  }

  get max() {
    if(this.form.shouldUseTestNet) {
      return environment.maxVotesCapTestNet;
    }

    return environment.maxVotesCap;
  }

  isPopoverOpened: boolean = false;

  constructor() {
  }

  openPopover() {
    if(this.popover && !this.isPopoverOpened) {
      this.isPopoverOpened = true;
      this.popover.show();
    }

  }

  closePopover() {
    if(this.popover && this.isPopoverOpened) {
      this.isPopoverOpened = false;
      this.popover.hide();
    }
  }
}
