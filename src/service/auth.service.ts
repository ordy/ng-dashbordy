import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../shared/user';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  DocumentReference,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: firebase.User;
  public userRef: DocumentReference;
  public docRef: DocumentData;

  public usersList: User[];
  public usersDB: AngularFirestoreCollection;

  public lastUserName: string;
  public loading = new BehaviorSubject<boolean>(false);
  public loggedIn = new BehaviorSubject<boolean>(false);
  public currentUser = new BehaviorSubject<string>('unset');
  public userInit = firebase.initializeApp(
    environment.firebaseConfig,
    'userCreationEnv'
  );

  constructor(public fireAuth: AngularFireAuth, public db: AngularFirestore) {
    this.authState();
  }

  async authState(): Promise<void> {
    await this.fireAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.loggedIn.next(true);
        this.fireAuth.authState.subscribe((res: firebase.User) => {
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
    this.currentUser.next('NOPE');
    return this.currentUser.asObservable();
  }
}
