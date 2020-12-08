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
  public submitted: boolean;

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

  addUser(): void {
    this.submitted = false;
    this.dialogUser = {};
    this.showDialog = true;
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
        this.userS.deleteUser(this.selectedUser.uid);
        this.notifyMsg('success', 'Deleted', 'The user has been removed!');
      },
    });
  }

  // Working on a copy to avoid data binding on input
  editUser(): void {
    this.dialogUser = { ...this.selectedUser };
    this.showDialog = true;
  }

  saveUser(): void {
    this.submitted = true;
    if (this.dialogUser.uid) {
      const currentUser = this.usersTable.findIndex(
        (usr) => usr.email === this.dialogUser.email
      );
      this.usersTable[currentUser] = { ...this.dialogUser };
      this.selectedUser = { ...this.dialogUser };
      this.userS.updateUser(this.selectedUser);
      this.showDialog = false;
      this.notifyMsg('success', 'Edit user', 'Successfully edited!');
    } else {
      this.userS.addUser(this.dialogUser).then((res) => {
        this.dialogUser.uid = res;
        this.usersTable.push(this.dialogUser);
      });
      this.showDialog = false;
      this.notifyMsg('success', 'New user', 'Successfully added!');
    }
  }

  notifyMsg(type: string, title: string, message: string): void {
    this.messageService.add({
      severity: type,
      summary: title,
      detail: message,
    });
  }

  hideDialog(): void {
    this.submitted = false;
    this.showDialog = false;
  }

  logUser(): void {
    this.usersTable.forEach((el) => {
      for (const [key, value] of Object.entries(el)) {
        console.log(key, value);
      }
    });
  }
}
