import {Component} from '@angular/core';

@Component({
  selector: 'app-voting-question',
  templateUrl: './voting-question.component.html',
  styleUrls: ['./voting-question.component.scss']
})
export class VotingQuestionComponent {
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

  get warnMessage(): string {
    if (!this.isQuestionValid) {
      return "Question's length should be > 1 and < 1000.";
    }

    if (!this.isOptionsLengthValid) {
      return "There must be at least 2 options."
    }

    if(!this.areAllOptionsValid()) {
      return "Each option must have length > 1 and < 1000";
    }

    return "";
  }

  constructor() {
  }

  isOptionValidAt(i: number) {
    return this.isOptionValid(this.options[i]);
  }

  isOptionValid(option: string): boolean {
    return option.length > 1 && option.length < 1000;
  }

  addOptionClicked() {
    this.options.push("");
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  deleteOptionClicked(i: number) {
    this.options.splice(i, 1);
  }

  preventPropagationOf(event: any) {
    event.stopPropagation();
  }

  private areAllOptionsValid() {
    return this.options
      .map(o => this.isOptionValid(o))
      .reduce((prev, current) => prev && current, true);
  }
}
