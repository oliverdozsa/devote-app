import {Component} from '@angular/core';
import {NbIconLibraries, NbMenuBag, NbMenuItem, NbMenuService, NbSidebarService} from "@nebular/theme";
import {NbAuthResult, NbAuthService} from "@nebular/auth";
import {delay, filter, finalize, map, Subscription, takeUntil} from "rxjs";
import {AppRoutes} from "../app-routes";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {Location} from "@angular/common";
import {UserInfo, UserService} from "./services/user.service";

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
      hidden: true,
      link: AppRoutes.MY_PROFILE
    },
    {
      title: MainMenuItemTitles.PUBLIC_VOTINGS,
      icon: {icon: 'bullhorn', pack: 'fas'},
      link: AppRoutes.PUBLIC_VOTINGS
    },
    {
      title: MainMenuItemTitles.MY_CREATED_VOTINGS,
      icon: {icon: 'list', pack: 'fas'},
      hidden: true,
      link: AppRoutes.MY_CREATED_VOTING
    },
    {
      title: MainMenuItemTitles.VOTINGS_WHERE_I_PARTICIPATE,
      icon: {icon: 'person-booth', pack: 'fas'},
      hidden: true,
      link: AppRoutes.VOTINGS_WHERE_I_PARTICIPATE
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

  userInfo: UserInfo | undefined;
  isUserInfoLoading = false;

  isSideBarCollapsed = true;

  private userInfoSubscription: Subscription | undefined;

  constructor(private iconLibraries: NbIconLibraries, private sidebarService: NbSidebarService,
              private authService: NbAuthService, private menuService: NbMenuService, private router: Router,
              private userService: UserService
  ) {
    this.iconLibraries.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});
    this.iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});

    router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        map(event => event as NavigationStart)
      )
      .subscribe({
        next: e => {
          this.mainMenuItems.forEach(i => {
            if (i.link != undefined) {
              i.selected = e.url.includes(i.link)
            }
          });
        }
      });

    this.registerCustomIcons(iconLibraries);

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
    console.log(`isAuthenticated: ${isAuthenticated}`);

    if (isAuthenticated) {
      this.showMenuItems(MainMenuItemTitles.PROTECTED_MENU_ITEMS);
      this.showMenuItems([MainMenuItemTitles.LOGOUT]);
      this.hideMenuItems([MainMenuItemTitles.LOGIN]);

      this.isUserInfoLoading = true;
      this.userInfoSubscription = this.userService.getUserInfo()
        .pipe(
          finalize(() => {
            this.isUserInfoLoading = false;
            this.userInfoSubscription?.unsubscribe();
          })
        )
        .subscribe({next: u => this.onUserInfoReceived(u)})
    } else {
      this.hideMenuItems(MainMenuItemTitles.PROTECTED_MENU_ITEMS);
      this.hideMenuItems([MainMenuItemTitles.LOGOUT]);
      this.showMenuItems([MainMenuItemTitles.LOGIN]);

      this.userInfo = undefined;
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
    this.mainMenuItems.forEach(i => {
      i.selected = menuBag.item.title == i.title;
    });

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

  registerCustomIcons(iconLibraries: NbIconLibraries) {
    iconLibraries.getPack("eva").icons.set(
      "stellar", "<img src='./assets/icons/stellar.svg' width='25px'/>"
    );
  }

  private onUserInfoReceived(userInfo: UserInfo) {
    this.isUserInfoLoading = false;
    this.userInfo = userInfo;
  }
}
