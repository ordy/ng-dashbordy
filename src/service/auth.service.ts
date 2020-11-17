import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
// import { User } from '../shared/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: firebase.default.User;

  public lastUserName: string;
  public loading = new BehaviorSubject<boolean>(false);
  public loggedIn = new BehaviorSubject<boolean>(false);
  public currentUser = new BehaviorSubject<string>('');

  constructor(
    public fireAuth: AngularFireAuth,
    public db: AngularFirestore,
    private route: Router
  ) {
    this.fireAuth.onAuthStateChanged((user: firebase.default.User) => {
      if (user) {
        this.loggedIn.next(true);
        this.fireAuth.authState.subscribe((res: firebase.default.User) => {
          this.user = res;
          if (res != null) {
            this.currentUser.next(res.email);
          }
        });
      }
    });
  }

  signOut(): void {
    this.loading.next(true);
    this.fireAuth.signOut();
    this.loggedIn.next(false);
    this.currentUser.next('OUT');
    // this.user = null;
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

  get currentUserNM(): Observable<string> {
    return this.currentUser.asObservable();
  }

  // get currentUID(): string {
  //   return auth().currentUser.uid;
  // }
}
