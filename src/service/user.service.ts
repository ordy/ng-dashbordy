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

  async addUser(newUser: User): Promise<string> {
    const uid = await this.authS
      .addNewUser(newUser.email, this.passwordGen())
      .then(() => {
        newUser.uid = uid;
        this.usersDB.doc(uid).set({
          email: newUser.email,
          firstname: newUser.firstname,
          surname: newUser.surname,
        });
        return uid;
      });
    this.usersList.push(newUser);
    return uid;
  }

  deleteUser(userID: string): void {
    this.usersDB.doc(userID);
    this.usersList = this.usersList.filter((res) => res.uid !== userID);
  }

  updateUser(user: User): void {
    user.lastLogged = new Date();
    this.usersDB.doc(user.uid).set(user);
    const index = this.usersList.findIndex((usr) => usr.email === user.email);
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
