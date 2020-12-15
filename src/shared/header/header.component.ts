import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName: string;
  public currentUser: Observable<string>;
  public isLogged: Observable<boolean>;
  public items: MenuItem[];

  constructor(private authS: AuthService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Log out',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.logout();
        },
      },
    ];
    this.isLogged = this.authS.isLoggedIn;
    this.currentUser = this.authS.currentUserID;
  }

  logout(): void {
    this.authS.signOut();
  }
}
