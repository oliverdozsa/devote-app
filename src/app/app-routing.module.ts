import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppRoutes} from "../app-routes";
import {LoginCallbackComponent} from "./pages/auth/login-callback/login-callback.component";
import {HomeComponent} from "./pages/home/home.component";

const routes: Routes = [
  {path: AppRoutes.HOME, component: HomeComponent},
  {path: AppRoutes.LOGIN + "/:oauthprov", component: LoginCallbackComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
