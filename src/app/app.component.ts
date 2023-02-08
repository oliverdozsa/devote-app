import {Component} from '@angular/core';
import {
  NbIconLibraries,
  NbMediaBreakpointsService,
  NbMenuBag,
  NbMenuItem,
  NbMenuService,
  NbSidebarService
} from "@nebular/theme";
import {NbAuthResult, NbAuthService, NbAuthToken} from "@nebular/auth";
import {filter, finalize, map, Subscription, takeUntil} from "rxjs";
import {AppRoutes} from "../app-routes";
import {NavigationStart, Router} from "@angular/router";
import {UserInfo, UserService} from "./services/user.service";
import {TokenAuthToken} from "./services/token-auth-token";

export class MainMenuItemTitles {
  static HOME = 'home';
  static PUBLIC_VOTINGS = 'public votings';
  static MY_PROFILE = 'my profile';
  static MY_CREATED_VOTINGS = 'my created votings';
  static VOTINGS_WHERE_I_PARTICIPATE = 'votings where I participate';
  static LOGIN = 'login';
  static LOGOUT = 'logout';

  static PROTECTED_MENU_ITEMS = [MainMenuItemTitles.MY_PROFILE, MainMenuItemTitles.MY_CREATED_VOTINGS,
    MainMenuItemTitles.VOTINGS_WHERE_I_PARTICIPATE];
  static MENU_ITEMS_NOT_VALID_IN_TOKEN_AUTH = [MainMenuItemTitles.MY_PROFILE, MainMenuItemTitles.MY_CREATED_VOTINGS];
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

  private userInfoSubscription: Subscription | undefined;
  private tokenSubscription: Subscription | undefined;

  constructor(private iconLibraries: NbIconLibraries, private sidebarService: NbSidebarService,
              private authService: NbAuthService, private menuService: NbMenuService, private router: Router,
              private userService: UserService, private breakPointsService: NbMediaBreakpointsService
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
    const shouldCompact = this.isOnMediumOrLargerScreen();
    this.sidebarService.toggle(shouldCompact, 'main');
  }

  onIsAuthenticated(isAuthenticated: boolean) {
    if (isAuthenticated) {
      this.showMenuItems(MainMenuItemTitles.PROTECTED_MENU_ITEMS);
      this.showMenuItems([MainMenuItemTitles.LOGOUT]);
      this.hideMenuItems([MainMenuItemTitles.LOGIN]);

      this.tokenSubscription = this.authService.getToken()
        .pipe(
          finalize(() => this.tokenSubscription?.unsubscribe())
        )
        .subscribe(t => this.onTokenReceived(t))
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
    this.sidebarService.getSidebarState("main")
      .subscribe({
        next: s => {
          if (this.isOnXLargeScreen()) {
            return;
          }

          if (s != "compacted") {
            this.toggleMainMenu();
          }
        }
      });

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
        this.router.navigate(["/" + AppRoutes.HOME]);
      });

    this.authService
      .logout("tokenauth")
      .subscribe((authResult: NbAuthResult) => {
        this.router.navigate(["/" + AppRoutes.HOME]);
      });
  }

  registerCustomIcons(iconLibraries: NbIconLibraries) {
    iconLibraries.getPack("eva").icons.set(
      "stellar", "<img src='./assets/icons/stellar.svg' width='25px'/>"
    );
  }

  private onTokenReceived(token: NbAuthToken) {
    if (token instanceof TokenAuthToken) {
      this.hideMenuItems(MainMenuItemTitles.MENU_ITEMS_NOT_VALID_IN_TOKEN_AUTH);
    } else {
      this.showMenuItems(MainMenuItemTitles.MENU_ITEMS_NOT_VALID_IN_TOKEN_AUTH);
      this.getUserInfo();
    }
  }

  private getUserInfo() {
    this.isUserInfoLoading = true;
    this.userInfoSubscription = this.userService.getUserInfo()
      .pipe(
        finalize(() => {
          this.isUserInfoLoading = false;
          this.userInfoSubscription?.unsubscribe();
        })
      )
      .subscribe({next: u => this.onUserInfoReceived(u)})
  }

  private onUserInfoReceived(userInfo: UserInfo) {
    this.isUserInfoLoading = false;
    this.userInfo = userInfo;
  }

  private isOnMediumOrLargerScreen() {
    return window.innerWidth > this.breakPointsService.getByName('sm').width;
  }

  private isOnXLargeScreen() {
    return window.innerWidth >= this.breakPointsService.getByName('xl').width;
  }
}
