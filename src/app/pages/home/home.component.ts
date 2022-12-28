import { Component, OnInit } from '@angular/core';
import {AppRoutes} from "../../../app-routes";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  AppRoutes = AppRoutes;

  constructor() {
    localStorage.setItem("lastVisitedPage", `/${AppRoutes.HOME}`)
  }

  ngOnInit(): void {
  }

}
