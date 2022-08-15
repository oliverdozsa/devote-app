import {Component} from '@angular/core';
import {NbIconLibraries, NbMenuBag, NbMenuItem, NbMenuService, NbSidebarService} from "@nebular/theme";
import {NbAuthResult, NbAuthService} from "@nebular/auth";
import {filter, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'devote-app';
  mainMenuItems: NbMenuItem[] = [
    {
      title: 'my profile',
      icon: {icon: 'user', pack: 'fas'},
      hidden: true
    },
    {
      title: 'my created votings',
      icon: {icon: 'list', pack: 'fas'},
      hidden: true
    },
    {
      title: 'votings where I participate',
      icon: {icon: 'person-booth', pack: 'fas'},
      hidden: true
    },
    {
      title: 'login',
      icon: {icon: 'arrow-right-to-bracket', pack: 'fas'},
      hidden: true
    },
    {
      title: 'logout',
      icon: {icon: 'arrow-right-from-bracket', pack: 'fas'},
      hidden: true
    }
  ];

  isSideBarCollapsed = true;

  constructor(private iconLibraries: NbIconLibraries, private sidebarService: NbSidebarService,
              private authService: NbAuthService, private menuService: NbMenuService
  ) {
    this.iconLibraries.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});
    this.iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});

    this.authService.onAuthenticationChange()
      .subscribe({
        next: v => this.onIsAuthenticated(v)
      });

    this.menuService.onItemClick()
      .pipe(
        filter(i => i.tag == "mainMenuItems")
      )
      .subscribe({
        next: i => this.onMainMenuItemSelected(i)
      });
  }

  toggleMainMenu() {
    this.sidebarService.toggle(true, 'main');
    this.isSideBarCollapsed = !this.isSideBarCollapsed;
  }

  onIsAuthenticated(isAuthenticated: boolean) {
    const logInMenuItem = this.mainMenuItems
      .find(m => m.title == 'login');

    const logOutMenuItem = this.mainMenuItems
      .find(m => m.title == 'logout');

    if(isAuthenticated) {
      logInMenuItem!.hidden = true;
      logOutMenuItem!.hidden = false;
    } else {
      logInMenuItem!.hidden = false;
      logOutMenuItem!.hidden = true;
    }
  }

  onMainMenuItemSelected(menuBag: NbMenuBag) {
    if (menuBag.item.title == 'login') {
      this.login();
    } else if (menuBag.item.title == 'logout') {
      this.logout();
    }
  }

  login() {
    this.authService
      .authenticate("auth0")
      .subscribe((authResult: NbAuthResult) => {
      });
  }

  logout() {
    this.authService
      .logout("auth0")
      .subscribe((authResult: NbAuthResult) => {
      });
  }
}
