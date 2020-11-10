import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SidebarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ButtonModule, CardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
