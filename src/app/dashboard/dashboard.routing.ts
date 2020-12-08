import { Routes } from '@angular/router';
import { RouteGuard } from 'src/service/route.guard';

import { UsersComponent } from '../users/users.component';
import { DashboardComponent } from './dashboard.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RouteGuard],
    data: { title: 'Dashboard' },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [RouteGuard],
    data: { title: 'Users' },
  },
];
