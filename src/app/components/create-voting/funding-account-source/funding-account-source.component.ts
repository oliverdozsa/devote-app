import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-funding-account-source',
  templateUrl: './funding-account-source.component.html',
  styleUrls: ['./funding-account-source.component.scss']
})
export class FundingAccountSourceComponent implements OnInit {
  shouldUseTestNet = true;
  isFundingPublicValid = false;
  isFundingSecretValid = false;

  constructor() { }

  ngOnInit(): void {
  }

}
