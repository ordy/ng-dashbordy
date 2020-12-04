import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from 'src/service/user.service';
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
  public dialogUser: User;
  public showDialog: boolean;

  constructor(
    public userS: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.getUsers();
    this.showDialog = false;
  }

  ngOnInit(): void {}

  async getUsers(): Promise<void> {
    this.usersTable = await this.userS.fetchUsers();
  }

  addUser() {
    this.messageService.add({
      severity: 'success',
      summary: 'New user',
      detail: 'Successfully added!',
    });
    //this.userS.updateUser(this.selectedUser);
  }

  deleteUser(): void {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' +
        this.selectedUser.firstname.bold() +
        ' ' +
        this.selectedUser.surname.bold() +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersTable = this.usersTable.filter(
          (res) => res.email !== this.selectedUser.email
        );
        this.userS.deleteUser(this.selectedUser.email);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'The user has been removed!',
          life: 3000,
        });
      },
    });
  }

  // Working on a copy to avoid data binding on input
  editUser(): void {
    this.showDialog = true;
    this.dialogUser = { ...this.selectedUser };
  }

  saveUser(): void {
    const currentUser = this.usersTable.findIndex(
      (usr) => usr.email === this.dialogUser.email
    );
    this.usersTable[currentUser] = { ...this.dialogUser };
    this.selectedUser = { ...this.dialogUser };
    console.log(this.selectedUser);
    this.userS.updateUser(this.selectedUser);
    this.showDialog = false;
  }

  hideDialog() {
    this.showDialog = false;
  }

  toDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
