import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
    children: [
      {
        path: 'users',
        component: UsersComponent,
        data: { title: 'Users' },
      },
    ],
  },
  { path: 'login', component: LoginComponent, data: { title: 'Admin Login' } },
  { path: 'spinner', component: SpinnerComponent, data: { title: 'Loading' } },
  { path: '**', component: DashboardComponent, data: { title: 'Dashboard' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
