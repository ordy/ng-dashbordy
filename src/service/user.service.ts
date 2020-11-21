import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public usersList: User[];
  public usersDB: AngularFirestoreCollection;

  constructor(public db: AngularFirestore, public authS: AuthService) {
    console.log('in user service');
  }

  async fetchUsers(): Promise<User[]> {
    if (this.usersList == null) {
      this.usersDB = this.db.collection('users');
      this.usersList = [];
      await this.usersDB.get().forEach((el) => {
        el.forEach((x) => {
          const user: User = {
            uid: 'toDefine',
            firstname: x.get('firstname'),
            surname: x.get('surname'),
            email: x.get('email'),
            city: x.get('city'),
            phone: x.get('phone'),
            lastLogged: x.get('lastLogged'),
            isAdmin: x.get('isAdmin'),
          };
          this.usersList.push(user);
        });
      });
    }
    return this.usersList;
  }

  addUser() {}
  deleteUser() {}
  updateUser() {}
}
