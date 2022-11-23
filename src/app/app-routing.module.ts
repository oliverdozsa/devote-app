import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppRoutes} from "../app-routes";
import {LoginCallbackComponent} from "./pages/auth/login-callback/login-callback.component";
import {HomeComponent} from "./pages/home/home.component";
import {PublicVotingsComponent} from "./pages/public-votings/public-votings.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {MyCreatedVotingsComponent} from "./pages/my-created-votings/my-created-votings.component";
import {CreateVotingComponent} from "./pages/create-voting/create-voting.component";
import {ViewVotingComponent} from "./pages/view-voting/view-voting.component";
import {
  VotingsWhereIParticipateComponent
} from "./pages/votings-where-i-participate/votings-where-i-participate.component";
import {CastVoteComponent} from "./pages/cast-vote/cast-vote.component";

const routes: Routes = [
  {path: AppRoutes.HOME, component: HomeComponent},
  {path: AppRoutes.PUBLIC_VOTINGS, component: PublicVotingsComponent},
  {path: AppRoutes.LOGIN + "/:oauthprov", component: LoginCallbackComponent},
  {path: AppRoutes.MY_CREATED_VOTING, component: MyCreatedVotingsComponent},
  {path: AppRoutes.CREATE_VOTING, component: CreateVotingComponent},
  {path: AppRoutes.VIEW_VOTING + "/:id", component: ViewVotingComponent},
  {path: AppRoutes.VOTINGS_WHERE_I_PARTICIPATE, component: VotingsWhereIParticipateComponent},
  {path: AppRoutes.CAST_VOTE + "/:id", component: CastVoteComponent},
  {path: '', redirectTo: '/' + AppRoutes.HOME, pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
