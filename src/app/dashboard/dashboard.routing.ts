import { Routes } from '@angular/router';

import { UsersComponent } from '../users/users.component';
import { DashboardComponent } from './dashboard.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
];