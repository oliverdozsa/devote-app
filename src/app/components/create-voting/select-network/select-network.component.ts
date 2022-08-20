import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-network',
  templateUrl: './select-network.component.html',
  styleUrls: ['./select-network.component.scss']
})
export class SelectNetworkComponent implements OnInit {
  selectedNetwork = "";

  get isValid() {
    return this.selectedNetwork != "";
  }

  constructor() { }

  ngOnInit(): void {
  }

}
