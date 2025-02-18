import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { CollectionReference, Firestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc } from '@angular/fire/firestore';

// import {
//   AngularFirestore,
//   AngularFirestoreCollection,
// } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public usersList: User[];
  public usersDB: CollectionReference;

  constructor(public db: Firestore, public authS: AuthService) {
    this.usersDB = collection(this.db, 'users');
  }

  async fetchUsers(): Promise<User[]> {
    if (this.usersList == null) {
      this.usersList = [];
      const querySnapshot = await getDocs(this.usersDB);
      querySnapshot.forEach((x) => {
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
        const docRef = doc(this.usersDB, userID);
        setDoc(docRef, newUser);
      });
    this.usersList.push(newUser);
  }

  async deleteUser(userID: string): Promise<void> {
    const docRef = doc(this.usersDB, userID);
    deleteDoc(docRef);
    this.usersList = this.usersList.filter((res) => res.uid !== userID);
  }

  updateUser(user: User): void {
    Object.keys(user).forEach((key) => {
      if (user[key] == null) {
        delete user[key];
      }
    });
    const docRef = doc(this.usersDB, user.uid);
    setDoc(docRef, user, { merge: true });
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
