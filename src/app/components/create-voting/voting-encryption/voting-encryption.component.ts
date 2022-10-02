import {Component, Input} from '@angular/core';
import {CreateVotingForm} from "../create-voting-form";
import {NbDateService} from "@nebular/theme";

@Component({
  selector: 'app-voting-encryption',
  templateUrl: './voting-encryption.component.html',
  styleUrls: ['./voting-encryption.component.scss']
})
export class VotingEncryptionComponent {
  min: Date;
  max: Date;

  @Input()
  form: CreateVotingForm = new CreateVotingForm();

  constructor(dateService: NbDateService<Date>) {
    this.min = dateService.addDay(dateService.today(), 1);
    this.max = dateService.addYear(dateService.today(), 4);
  }

}
