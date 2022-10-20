import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-voting',
  templateUrl: './view-voting.component.html',
  styleUrls: ['./view-voting.component.scss']
})
export class ViewVotingComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    const votingId = route.snapshot.paramMap.get("id")!;
    // TODO
    console.log(`Getting voting with id: ${votingId}`);
  }

  ngOnInit(): void {
  }

}
