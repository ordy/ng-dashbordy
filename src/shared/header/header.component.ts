import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { MenuItem } from 'primeng/api';
import { User } from '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName: string;
  public display = false;
  public currentUser: string;
  public isLogged: Observable<boolean>;
  public items: MenuItem[];

  constructor(private authS: AuthService) {
    this.isLogged = this.authS.isLoggedIn;
    this.authS.$usr.subscribe(usr => {
      this.currentUser = usr.displayName;
    });
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Log out',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.authS.signOut();
        },
      },
    ];
  }
}
