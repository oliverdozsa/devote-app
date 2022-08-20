import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppRoutes} from "../app-routes";
import {LoginCallbackComponent} from "./pages/auth/login-callback/login-callback.component";
import {HomeComponent} from "./pages/home/home.component";
import {PublicVotingsComponent} from "./pages/public-votings/public-votings.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {MyCreatedVotingsComponent} from "./pages/my-created-votings/my-created-votings.component";

const routes: Routes = [
  {path: AppRoutes.HOME, component: HomeComponent},
  {path: AppRoutes.PUBLIC_VOTINGS, component: PublicVotingsComponent},
  {path: AppRoutes.LOGIN + "/:oauthprov", component: LoginCallbackComponent},
  {path: AppRoutes.MY_CREATED_VOTING, component: MyCreatedVotingsComponent},
  {path: '', redirectTo: '/' + AppRoutes.HOME, pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
