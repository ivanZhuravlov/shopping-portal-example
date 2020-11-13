import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserPortalComponent} from './user-portal/user-portal.component';
import {AuthGuard} from './guards/auth.guard';
import {AdminPortalComponent} from './admin-portal/admin-portal.component';
import {AdminGuard} from './guards/admin.guard';
import {LoginComponent} from './login/login.component';
import {RegisterUserComponent} from './register-user/register-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'user', component: UserPortalComponent, canActivate: [AuthGuard] },
  {path: 'admin', component: AdminPortalComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard],
})
export class AppRoutingModule { }
