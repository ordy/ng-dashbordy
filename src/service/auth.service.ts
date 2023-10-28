import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: firebase.User;
  public docRef: DocumentData;

  public usersDB: AngularFirestoreCollection;

  public lastUserName: string;
  public loading = new BehaviorSubject<boolean>(false);
  public loggedIn = new BehaviorSubject<boolean>(false);
  public currentUser = new BehaviorSubject<string>('');
  public userInit = firebase.initializeApp(
    environment.firebaseConfig,
    'userCreationEnv'
  );

  constructor(
    public fireAuth: AngularFireAuth,
    public db: AngularFirestore,
    public route: Router
  ) {
    this.authState();
  }

  async authState(): Promise<void> {
    await this.fireAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.loggedIn.next(true);
        this.fireAuth.authState.subscribe((res: firebase.User) => {
          if (res) {
            this.user = res;
            this.updateUserInfo();
          }
        });
      }
    });
  }

  async updateUserInfo(): Promise<void> {
    this.docRef = this.db.firestore.collection('users').doc(this.user.uid);
    await this.docRef.get().then((usr: DocumentData) => {
      this.currentUser.next(usr.get('firstname') + ' ' + usr.get('surname'));
    });
  }

  signOut(): void {
    this.loading.next(true);
    this.fireAuth.signOut();
    this.loggedIn.next(false);
    this.currentUser.next('Log in');
    this.user = null;
    this.route.navigateByUrl('/login');
    this.loading.next(false);
  }

  async signIn(username: string, password: string): Promise<any> {
    this.loading.next(true);
    this.fireAuth.setPersistence('local');
    return this.fireAuth
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        this.loggedIn.next(true);
        this.loading.next(false);
        this.route.navigateByUrl('/');
      })
      .catch((error) => {
        window.alert(error.message);
        this.loading.next(false);
      });
  }

  // Creating new users without changing the admin auth state
  async addNewUser(mail: string, pass: string): Promise<string> {
    const uid = await this.userInit
      .auth()
      .createUserWithEmailAndPassword(mail, pass)
      .then((usr) => {
        return usr.user.uid;
      });
    this.userInit.auth().signOut();
    return uid;
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get currentUserID(): Observable<string> {
    return this.currentUser.asObservable();
  }
}
