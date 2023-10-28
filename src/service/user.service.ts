import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public usersList: User[];
  public usersDB: AngularFirestoreCollection;

  constructor(public db: AngularFirestore, public authS: AuthService) {
    this.usersDB = this.db.collection('users');
  }

  async fetchUsers(): Promise<User[]> {
    if (this.usersList == null) {
      this.usersList = [];
      await this.usersDB.get().forEach((el) => {
        el.forEach((x) => {
          const user: User = {
            uid: x.get('uid'),
            firstname: x.get('firstname'),
            surname: x.get('surname'),
            email: x.get('email'),
            city: x.get('city'),
            region: x.get('region'),
            phone: x.get('phone'),
            lastLogged: x.get('lastLogged')?.toDate(),
            isAdmin: x.get('isAdmin'),
          };
          this.usersList.push(user);
        });
      });
    }
    return this.usersList;
  }

  async addUser(newUser: User): Promise<void> {
    await this.authS
      .addNewUser(newUser.email, this.passwordGen())
      .then((userID) => {
        newUser.uid = userID;
        // removing empty data
        Object.keys(newUser).forEach((key) => {
          if (newUser[key] == null) {
            delete newUser[key];
          }
        });
        this.usersDB.doc(userID).set(newUser);
      });
    this.usersList.push(newUser);
  }

  deleteUser(userID: string): void {
    this.usersDB.doc(userID).delete();
    this.usersList = this.usersList.filter((res) => res.uid !== userID);
  }

  updateUser(user: User): void {
    Object.keys(user).forEach((key) => {
      if (user[key] == null) {
        delete user[key];
      }
    });
    this.usersDB.doc(user.uid).set(user, { merge: true });
    const index = this.usersList.findIndex((usr) => usr.uid === user.uid);
    this.usersList[index] = { ...user };
  }

  // Return a random password between 16 and 25 characters
  passwordGen = (): string => {
    let pw = '';
    const allChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!@#$%&*ˆ+=_]';
    const specials = '-!@#$%&*ˆ+=_]';
    const numbers = '0123456789';
    pw = pw.concat(
      specials.charAt(Math.floor(Math.random() * specials.length))
    );
    pw = pw.concat(numbers.charAt(Math.floor(Math.random() * 10)));
    const charsLength = allChars.length;
    // returns a random number from 14 to 23
    const size = Math.floor(Math.random() * 9) + 14;
    for (let i = 0; i < size; i++) {
      pw = pw.concat(allChars.charAt(Math.floor(Math.random() * charsLength)));
    }
    return pw;
  };
}
