import {Component} from '@angular/core';
import {NbIconLibraries, NbMenuItem, NbSidebarService} from "@nebular/theme";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'devote-app';
  menuItems: NbMenuItem[] = [
    {
      title: 'my profile',
      icon: {icon: 'user', pack: 'fas'}
    },
    {
      title: 'my created votings',
      icon: {icon: 'list', pack: 'fas'}
    },
    {
      title: 'votings where I participate',
      icon: {icon: 'person-booth', pack: 'fas'}
    }
  ];

  isSideBarCollapsed = true;

  constructor(
    private iconLibraries: NbIconLibraries,
    private sidebarService: NbSidebarService
  ) {
    this.iconLibraries.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});
    this.iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
  }

  toggleMainMenu() {
    this.sidebarService.toggle(true, 'main');
    this.isSideBarCollapsed = !this.isSideBarCollapsed;
  }
}
