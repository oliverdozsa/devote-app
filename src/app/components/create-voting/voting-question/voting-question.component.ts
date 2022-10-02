import {Component} from '@angular/core';

@Component({
  selector: 'app-voting-question',
  templateUrl: './voting-question.component.html',
  styleUrls: ['./voting-question.component.scss']
})
export class VotingQuestionComponent {
  options: string[] = [];
  question: string = "";

  constructor() {
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
}
