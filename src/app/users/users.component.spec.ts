import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UserService } from 'src/service/user.service';
import { User } from 'src/shared/user';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        CardModule,
        TableModule,
        DialogModule,
        ToolbarModule,
        ConfirmDialogModule,
        ToastModule,
      ],
      providers: [{ provide: UserService, useClass: UserServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(fakeAsync(() => {
    component.getUsers();
    tick();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog and setting the global variables', () => {
    component.addUser();
    expect(component.submitted).toBeFalse();
    expect(component.showDialog).toBeTrue();
    expect(component.dialogUser).toEqual({});
  });

  it('should hide the dialog', () => {
    component.hideDialog();
    expect(component.submitted).toBeFalse();
    expect(component.showDialog).toBeFalse();
  });

  it('should return admin', () => {
    const role = true;
    expect(component.roles(role)).toEqual('admin');
  });

  it('should have valid data', () => {
    const [firstname, surname] = ['name1', 'name2'];
    let email = 'email';
    expect(component.isValid(firstname, surname, email)).toBeTrue();
    email = '';
    expect(component.isValid(firstname, surname, email)).toBeFalse();
    expect(component.isValid(firstname, surname)).toBeFalse();
  });

  it('should be able to fetch users from the service', fakeAsync(() => {
    component.getUsers();
    tick();
    expect(component.usersTable.length).toBeGreaterThan(0);
  }));

  it('should edit an existing user', () => {
    const newUser: User = {
      uid: 'uid1',
      firstname: 'fn1-updated',
      surname: 'sn1',
      email: 'mail@1.com',
      city: 'city1',
      region: 'region1',
      phone: '(111) 111 - 1111',
      lastLogged: new Date(),
      isAdmin: true,
    };
    component.dialogUser = { ...newUser };
    component.saveUser();
    expect(component.usersTable[0].firstname).toEqual('fn1-updated');
  });

  it('should save a new user', fakeAsync(() => {
    const sizeOfTable = component.usersTable.length;
    const newUser: User = {
      firstname: 'fn3',
      surname: 'sn3',
      email: 'mail@3.com',
      city: 'city3',
      region: 'region3',
      phone: '(333) 333 - 3333',
      lastLogged: new Date(),
      isAdmin: true,
    };
    component.dialogUser = { ...newUser };
    component.saveUser();
    tick();
    expect(component.usersTable.length).toEqual(sizeOfTable + 1);
  }));
});

class UserServiceStub {
  public usersList: User[];

  async fetchUsers(): Promise<User[]> {
    this.usersList = [
      {
        uid: 'uid1',
        firstname: 'fn1',
        surname: 'sn1',
        email: 'mail@1.com',
        city: 'city1',
        region: 'region1',
        phone: '(111) 111 - 1111',
        lastLogged: new Date(),
        isAdmin: true,
      },
      {
        uid: 'uid2',
        firstname: 'fn2',
        surname: 'sn2',
        email: 'mail@2.com',
        city: 'city2',
        region: 'region2',
        phone: '(222) 222 - 2222',
        lastLogged: new Date(),
        isAdmin: true,
      },
    ];
    return this.usersList;
  }

  updateUser(): void {}
  async addUser(newUser: User): Promise<void> {
    newUser.uid = 'uid3';
    this.usersList.push(newUser);
  }
}
