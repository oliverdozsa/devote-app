import { Component, OnInit } from '@angular/core';
import {VotingsService} from "../../services/votings.service";

@Component({
  selector: 'app-votings-pagination',
  templateUrl: './votings.pagination.component.html',
  styleUrls: ['./votings.pagination.component.scss']
})
export class VotingsPaginationComponent implements OnInit {

  constructor(private votingsService: VotingsService) { }

  ngOnInit(): void {
  }

}
