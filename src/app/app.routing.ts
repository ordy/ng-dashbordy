import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { RouteGuard } from 'src/service/route.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
    canActivate: [RouteGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RouteGuard],
    data: { title: 'Dashboard' },
    children: [
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RouteGuard],
        data: { title: 'Users' },
      },
    ],
  },
  { path: 'login', component: LoginComponent, data: { title: 'Admin Login' } },
  {
    path: '**',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
