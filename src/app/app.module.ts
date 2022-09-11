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
    NbButtonGroupModule,
    NbListModule,
    NbSelectModule,
    NbFormFieldModule,
    NbInputModule,
    NbSpinnerModule,
    NbTooltipModule, NbPopoverModule, NbTagModule
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
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {MyCreatedVotingsComponent} from './pages/my-created-votings/my-created-votings.component';
import {CreateVotingComponent} from './components/create-voting/create-voting.component';
import {FormsModule} from "@angular/forms";
import {SelectNetworkComponent} from './components/create-voting/select-network/select-network.component';
import {
  FundingAccountSourceComponent
} from './components/create-voting/funding-account-source/funding-account-source.component';
import { AccountBalanceComponent } from './components/create-voting/account-balance/account-balance.component';
import { VotesCapComponent } from './components/create-voting/votes-cap/votes-cap.component';
import { VotingTitleComponent } from './components/create-voting/voting-title/voting-title.component';
import { VotingVisibilityAndAuthorizationComponent } from './components/create-voting/voting-visibility-and-authorization/voting-visibility-and-authorization.component';
import { VotingAuthorizationEmailsComponent } from './components/create-voting/voting-authorization-emails/voting-authorization-emails.component';
import { VotingAuthorizationInputComponent } from './components/create-voting/voting-authorization-input/voting-authorization-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginCallbackComponent,
    PublicVotingsComponent,
    PaginationComponent,
    VotingsPaginationComponent,
    PageNotFoundComponent,
    MyCreatedVotingsComponent,
    CreateVotingComponent,
    SelectNetworkComponent,
    FundingAccountSourceComponent,
    AccountBalanceComponent,
    VotesCapComponent,
    VotingTitleComponent,
    VotingVisibilityAndAuthorizationComponent,
    VotingAuthorizationEmailsComponent,
    VotingAuthorizationInputComponent
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
        NbSelectModule,
        NbListModule,
        NbToggleModule,
        NbInputModule,
        HttpClientModule,
        FormsModule,
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
                    },
                    redirect: {
                        success: getLastVisitedPage()
                    }
                })
            ]
        }),
        NbFormFieldModule,
        NbSpinnerModule,
        NbTooltipModule,
        NbPopoverModule,
        NbTagModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

function getLastVisitedPage(): string | undefined {
  return localStorage.getItem("lastVisitedPage") ? localStorage.getItem("lastVisitedPage")! : undefined;
}
