import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../shared/user';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  DocumentReference,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: firebase.default.User;
  public userRef: DocumentReference;
  public docRef: DocumentData;

  public usersList: User[];
  public usersDB: AngularFirestoreCollection;

  public lastUserName: string;
  public loading = new BehaviorSubject<boolean>(false);
  public loggedIn = new BehaviorSubject<boolean>(false);
  public currentUser = new BehaviorSubject<string>('unset');

  constructor(
    public fireAuth: AngularFireAuth,
    public db: AngularFirestore,
    private route: Router
  ) {
    console.log('authS constreucto');
    this.authState();
  }

  async authState(): Promise<void> {
    await this.fireAuth.onAuthStateChanged((user: firebase.default.User) => {
      if (user) {
        this.loggedIn.next(true);
        this.fireAuth.authState.subscribe((res: firebase.default.User) => {
          if (res != null) {
            this.user = res;
          }
        });
      }
    });
    this.updateUserInfo();
  }

  async updateUserInfo(): Promise<void> {
    this.docRef = this.db.firestore
      .collection('users')
      .where('firstname', '==', 'Sandro');
    await this.docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.currentUser.next(doc.data().firstname + ' ' + doc.data().surname);
      });
    });
  }

  signOut(): void {
    this.loading.next(true);
    this.fireAuth.signOut();
    this.loggedIn.next(false);
    this.currentUser.next('Log in');
    this.user = null;
    // this.route.navigateByUrl('/login');
    this.loading.next(false);
  }

  async signIn(
    username: string,
    password: string,
    keepLocal: boolean
  ): Promise<any> {
    // set persistence state if user wants to stay logged in
    this.loading.next(true);
    const logState = keepLocal ? 'local' : 'session';
    this.fireAuth.setPersistence(logState);
    // Auth and redirection to homepage
    return this.fireAuth
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        this.loggedIn.next(true);
        this.loading.next(false);
        this.updateUserInfo();
        // this.route.navigateByUrl('/');
      })
      .catch((error) => {
        window.alert(error.message);
        this.loading.next(false);
      });
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get currentUserID(): Observable<string> {
    this.currentUser.next('NOPE');
    return this.currentUser.asObservable();
  }

  async fetchUsers2(): Promise<User[]> {
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
}
