import {Component} from '@angular/core';
import {NbIconLibraries, NbMenuBag, NbMenuItem, NbMenuService, NbSidebarService} from "@nebular/theme";
import {NbAuthResult, NbAuthService} from "@nebular/auth";
import {filter} from "rxjs";
import {AppRoutes} from "../app-routes";

export class MainMenuItemTitles {
  static HOME = 'home';
  static PUBLIC_VOTINGS = 'public votings';
  static MY_PROFILE = 'my profile';
  static MY_CREATED_VOTINGS = 'my created votings';
  static VOTINGS_WHERE_I_PARTICIPATE = 'votings where I participate';
  static LOGIN = 'login';
  static LOGOUT = 'logout';

  static PROTECTED_MENU_ITEMS = [MainMenuItemTitles.MY_PROFILE, MainMenuItemTitles.MY_CREATED_VOTINGS,
    MainMenuItemTitles.VOTINGS_WHERE_I_PARTICIPATE]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'devote-app';
  mainMenuItems: NbMenuItem[] = [
    {
      title: MainMenuItemTitles.HOME,
      icon: {icon: 'house', pack: 'fas'},
      link: AppRoutes.HOME
    },
    {
      title: MainMenuItemTitles.MY_PROFILE,
      icon: {icon: 'user', pack: 'fas'},
      hidden: true
    },
    {
      title: MainMenuItemTitles.PUBLIC_VOTINGS,
      icon: {icon: 'bullhorn', pack: 'fas'},
      link: AppRoutes.PUBLIC_VOTINGS
    },
    {
      title: MainMenuItemTitles.MY_CREATED_VOTINGS,
      icon: {icon: 'list', pack: 'fas'},
      hidden: true
    },
    {
      title: MainMenuItemTitles.VOTINGS_WHERE_I_PARTICIPATE,
      icon: {icon: 'person-booth', pack: 'fas'},
      hidden: true
    },
    {
      title: MainMenuItemTitles.LOGIN,
      icon: {icon: 'arrow-right-to-bracket', pack: 'fas'},
      hidden: true
    },
    {
      title: MainMenuItemTitles.LOGOUT,
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
    if (isAuthenticated) {
      this.showMenuItems(MainMenuItemTitles.PROTECTED_MENU_ITEMS);
      this.showMenuItems([MainMenuItemTitles.LOGOUT]);
      this.hideMenuItems([MainMenuItemTitles.LOGIN])
    } else {
      this.hideMenuItems(MainMenuItemTitles.PROTECTED_MENU_ITEMS);
      this.hideMenuItems([MainMenuItemTitles.LOGOUT])
      this.showMenuItems([MainMenuItemTitles.LOGIN])
    }
  }

  hideMenuItems(names: string[]) {
    this.setIsHiddenForMenuItems(names, true);
  }

  showMenuItems(names: string[]) {
    this.setIsHiddenForMenuItems(names, false);
  }

  setIsHiddenForMenuItems(names: string[], shouldHide: boolean) {
    for (const name of names) {
      const menuItem = this.mainMenuItems.find(m => m.title == name)!;
      menuItem.hidden = shouldHide;
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
