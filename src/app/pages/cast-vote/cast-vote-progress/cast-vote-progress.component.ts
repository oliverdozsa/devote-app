import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from "@nebular/theme";
import {Voting} from "../../../services/voting";
import {CastVoteService} from "../../../services/cast-vote.service";
import {CastVoteOrchestration} from "./cast-vote-orchestration";
import {describeState} from "../../../data/progress";
import {Router} from "@angular/router";
import {AppRoutes} from "../../../../app-routes";

@Component({
  selector: 'app-cast-vote-progress',
  templateUrl: './cast-vote-progress.component.html',
  styleUrls: ['./cast-vote-progress.component.scss']
})
export class CastVoteProgressComponent implements OnInit {
  describeState = describeState;

  @Input()
  voting: Voting = new Voting();

  @Input()
  selectedOptions: any[] = [];

  orchestration: CastVoteOrchestration | undefined;

  get isCompleted(): boolean {
    return this.orchestration != undefined &&
      this.orchestration.isCompleted;
  }

  get progressPercent(): number {
    return this.orchestration == undefined ? 0 : this.orchestration.progressPercent;
  }

  constructor(private dialogRef: NbDialogRef<any>, private castVoteService: CastVoteService, private toastr: NbToastrService,
              private router: Router) {
  }

  onCloseClick() {
    this.dialogRef.close();
    this.router.navigateByUrl(`/${AppRoutes.VOTINGS_WHERE_I_PARTICIPATE}`);
  }

  ngOnInit(): void {
    this.orchestration = new CastVoteOrchestration(this.voting, this.selectedOptions, this.castVoteService, this.toastr);
    this.orchestration.castVote();
  }
}
