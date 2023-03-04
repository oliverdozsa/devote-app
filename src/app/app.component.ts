import {Component} from '@angular/core';
import {
  NbIconLibraries,
  NbMediaBreakpointsService,
  NbMenuBag,
  NbMenuService,
  NbSidebarService
} from "@nebular/theme";
import {NbAuthService, NbAuthToken} from "@nebular/auth";
import {filter, finalize, first, map, Subscription, takeUntil} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {UserInfo, UserService} from "./services/user.service";
import {TokenAuthToken} from "./services/token-auth-token";
import {Authentication} from "./authentication";
import {MainMenu} from "./main-menu";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  MainMenu = MainMenu;

  title = 'devote-app';

  userInfo: UserInfo | undefined;
  isUserInfoLoading = false;

  private userInfoSubscription: Subscription | undefined;
  private tokenSubscription: Subscription | undefined;
  private authenticationHelper: Authentication;

  constructor(private iconLibraries: NbIconLibraries, private sidebarService: NbSidebarService,
              private authService: NbAuthService, private menuService: NbMenuService, private router: Router,
              private userService: UserService, private breakPointsService: NbMediaBreakpointsService
  ) {
    this.authenticationHelper = new Authentication(authService, router);

    this.iconLibraries.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});
    this.iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});

    router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        map(event => event as NavigationStart)
      )
      .subscribe({
        next: e => {
          MainMenu.items.forEach(i => {
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
      this.showMenuItems(MainMenu.Titles.PROTECTED_MENU_ITEMS);
      this.showMenuItems([MainMenu.Titles.LOGOUT]);
      this.hideMenuItems([MainMenu.Titles.LOGIN]);

      this.tokenSubscription = this.authService.getToken()
        .pipe(
          finalize(() => this.tokenSubscription?.unsubscribe())
        )
        .subscribe(t => this.onTokenReceived(t))
    } else {
      this.hideMenuItems(MainMenu.Titles.PROTECTED_MENU_ITEMS);
      this.hideMenuItems([MainMenu.Titles.LOGOUT]);
      this.showMenuItems([MainMenu.Titles.LOGIN]);

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
      const menuItem = MainMenu.items.find(m => m.title == name)!;
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

    MainMenu.items.forEach(i => {
      i.selected = menuBag.item.title == i.title;
    });

    if (menuBag.item.title == 'login') {
      this.authenticationHelper.login();
    } else if (menuBag.item.title == 'logout') {
      this.authenticationHelper.logout();
    }

    this.checkLoginStatus();
  }

  registerCustomIcons(iconLibraries: NbIconLibraries) {
    iconLibraries.getPack("eva").icons.set(
      "stellar", "<img src='./assets/icons/stellar.svg' width='25px'/>"
    );
  }

  private onTokenReceived(token: NbAuthToken) {
    if (token instanceof TokenAuthToken) {
      this.hideMenuItems(MainMenu.Titles.MENU_ITEMS_NOT_VALID_IN_TOKEN_AUTH);
    } else {
      this.showMenuItems(MainMenu.Titles.MENU_ITEMS_NOT_VALID_IN_TOKEN_AUTH);
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

  private checkLoginStatus() {
    this.authService.isAuthenticated()
      .pipe(first())
      .subscribe({
        next: isAuth => this.onIsAuthenticated(isAuth)
      });
  }
}
