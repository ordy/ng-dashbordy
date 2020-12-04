import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public usersList: User[];
  public usersDB: AngularFirestoreCollection;
  public docRef;

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
            lastLogged: x.get('lastLogged').toDate(),
            isAdmin: x.get('isAdmin'),
          };
          this.usersList.push(user);
        });
      });
    }
    return this.usersList;
  }

  userRef(collection: string, field: string, value: string): DocumentData {
    return this.db.firestore.collection(collection).where(field, '==', value);
  }

  addUser(newUser: User): void {
    //newUser.uid = this.authS.signUp(newUser.email, this.passwordGen());
    this.usersList.push(newUser);
  }

  deleteUser(userEmail: string): void {
    this.userRef('users', 'email', userEmail)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  updateUser(user: User): void {
    user.lastLogged = new Date();
    this.userRef('users', 'email', user.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.set(user);
        });
      });
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
