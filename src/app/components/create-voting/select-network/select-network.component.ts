import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-network',
  templateUrl: './select-network.component.html',
  styleUrls: ['./select-network.component.scss']
})
export class SelectNetworkComponent implements OnInit {
  @Output()
  selectedNetworkChange: EventEmitter<string> = new EventEmitter<string>();

  get selectedNetwork() {
    return this._selectedNetwork;
  }

  set selectedNetwork(value: string) {
    this._selectedNetwork = value;
    this.selectedNetworkChange.next(this._selectedNetwork);
  }

  private _selectedNetwork = "";

  get isValid() {
    return this.selectedNetwork != "";
  }

  constructor() { }

  ngOnInit(): void {
  }

}
