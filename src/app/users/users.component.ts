import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/service/auth.service';
import { User } from 'src/shared/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class UsersComponent implements OnInit {
  public usersTable: User[] = [];
  public selectedUser: User;
  public user: User;
  public roles: string[] = ['admin', 'user'];

  constructor(
    // public userS: UserService,
    public authS: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.getUsers();
  }

  ngOnInit(): void {}

  async getUsers(): Promise<void> {
    this.usersTable = await this.authS.fetchUsers2();
  }

  addUser() {
    this.messageService.add({
      severity: 'success',
      summary: 'New user',
      detail: 'Successfully added!',
    });
  }

  deleteUser(): void {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' +
        this.selectedUser.firstname +
        this.selectedUser.surname +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersTable = this.usersTable.filter(
          (res) => res.email !== this.selectedUser.email
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted!',
          life: 3000,
        });
      },
    });
  }

  editUser() {
    // this.userS.updateUser();
  }
  displaySel() {
    console.log(this.selectedUser.firstname);
    console.log(this.user);
  }
}
