import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbIconModule,
  NbMenuModule,
  NbCardModule,
  NbDialogModule,
  NbGlobalPhysicalPosition,
  NbToastrModule,
  NbToggleModule,
  NbButtonGroupModule, NbListModule
} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {HomeComponent} from './pages/home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {NbAuthModule, NbOAuth2AuthStrategy, NbOAuth2ResponseType} from "@nebular/auth";
import {LoginCallbackComponent} from './pages/auth/login-callback/login-callback.component';
import {AppRoutes} from "../app-routes";
import {PublicVotingsComponent} from './pages/public-votings/public-votings.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {VotingsPaginationComponent} from './components/votings-pagination/votings.pagination.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginCallbackComponent,
    PublicVotingsComponent,
    PaginationComponent,
    VotingsPaginationComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbButtonModule,
    NbIconModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot({position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 4000}),
    NbEvaIconsModule,
    NbButtonGroupModule,
    NbListModule,
    HttpClientModule,
    NgxSpinnerModule,
    NbAuthModule.forRoot({
      strategies: [
        NbOAuth2AuthStrategy.setup({
          name: "auth0",
          clientId: "DgtatvQrzX90oaZNlhRevIVM3dwWPg2F",
          clientSecret: "",
          authorize: {
            endpoint: 'https://dev-devote.eu.auth0.com/authorize',
            responseType: NbOAuth2ResponseType.TOKEN,
            scope: 'openid profile email',
            redirectUri: location.origin +
              '/' + AppRoutes.LOGIN + "/auth0",
            params: {
              "audience": "https://dev-devote.eu.auth0.com/api/v2/"
            }
          }
        })
      ]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
