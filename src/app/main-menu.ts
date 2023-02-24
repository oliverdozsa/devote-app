import {NbMenuItem} from "@nebular/theme";
import {AppRoutes} from "../app-routes";

class MainMenuTitles {
  static HOME = 'home';
  static PUBLIC_VOTINGS = 'public votings';
  static MY_PROFILE = 'my profile';
  static MY_CREATED_VOTINGS = 'my created votings';
  static VOTINGS_WHERE_I_PARTICIPATE = 'votings where I participate';
  static LOGIN = 'login';
  static LOGOUT = 'logout';

  static PROTECTED_MENU_ITEMS = [MainMenuTitles.MY_PROFILE, MainMenuTitles.MY_CREATED_VOTINGS,
    MainMenuTitles.VOTINGS_WHERE_I_PARTICIPATE];
  static MENU_ITEMS_NOT_VALID_IN_TOKEN_AUTH = [MainMenuTitles.MY_PROFILE, MainMenuTitles.MY_CREATED_VOTINGS];
}

export class MainMenu {
  static Titles = MainMenuTitles;

  static items: NbMenuItem[] = [
    {
      title: MainMenu.Titles.HOME,
      icon: {icon: 'house', pack: 'fas'},
      link: AppRoutes.HOME
    },
    {
      title: MainMenu.Titles.MY_PROFILE,
      icon: {icon: 'user', pack: 'fas'},
      hidden: true,
      link: AppRoutes.MY_PROFILE
    },
    {
      title: MainMenu.Titles.PUBLIC_VOTINGS,
      icon: {icon: 'bullhorn', pack: 'fas'},
      link: AppRoutes.PUBLIC_VOTINGS
    },
    {
      title: MainMenu.Titles.MY_CREATED_VOTINGS,
      icon: {icon: 'list', pack: 'fas'},
      hidden: true,
      link: AppRoutes.MY_CREATED_VOTING
    },
    {
      title: MainMenu.Titles.VOTINGS_WHERE_I_PARTICIPATE,
      icon: {icon: 'person-booth', pack: 'fas'},
      hidden: true,
      link: AppRoutes.VOTINGS_WHERE_I_PARTICIPATE
    },
    {
      title: MainMenu.Titles.LOGIN,
      icon: {icon: 'arrow-right-to-bracket', pack: 'fas'},
      hidden: true
    },
    {
      title: MainMenu.Titles.LOGOUT,
      icon: {icon: 'arrow-right-from-bracket', pack: 'fas'},
      hidden: true
    }
  ];
}
