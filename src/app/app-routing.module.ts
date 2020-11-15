import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'user', component: UserPortalComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPortalComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'create', component: CreateProductComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'edit/user', component: EditUserComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'edit/product', component: EditProductComponent, canActivate: [AuthGuard, AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard],
})
export class AppRoutingModule { }
