import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	User,
	Auth,
	authState,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	user,
  getAuth,
} from '@angular/fire/auth';
// import { Firestore, getDoc, setDoc, doc, CollectionReference } from '@angular/fire/firestore';
import {
	Firestore,
	doc,
	collection,
	CollectionReference,
	getDocs,
	updateDoc,
	deleteDoc,
	setDoc,
	where,
	orderBy,
	limit,
	query,
	DocumentData,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public $usr: Observable<User>;
  public user: User;
  public docRef: CollectionReference;
  public userState = new Subject<string>();

  // public usersDB: AngularFirestoreCollection;

  public lastUserName: string;
  public loading = new BehaviorSubject<boolean>(false);
  public loggedIn = new BehaviorSubject<boolean>(false);
  public currentUser = new BehaviorSubject<string>('');
  public userInit = initializeApp(
    environment.firebaseConfig,
    'userCreationEnv'
  );

  constructor(
    @Optional() private auth: Auth,
		private db: Firestore,
    public route: Router
  ) {
    this.loading.next(false);
		this.$usr = user(auth);
		this.auth.onAuthStateChanged(user2 => {
			if (user2) {
				authState(this.auth).subscribe(res => {
					if (res) {
						this.loggedIn.next(true);
						this.userState.next(res.uid);
					}
				});
			}
		});
  }

  // async authState(): Promise<void> {
  //   await this.fireAuth.onAuthStateChanged((user: firebase.User) => {
  //     if (user) {
  //       this.loggedIn.next(true);
  //       this.fireAuth.authState.subscribe((res: firebase.User) => {
  //         if (res) {
  //           this.user = res;
  //           this.updateUserInfo();
  //         }
  //       });
  //     }
  //   });
  // }

  // async updateUserInfo(): Promise<void> {
  //   this.docRef = collection(this.db, 'users');
  //   const userRef = doc(this.docRef, this.auth.currentUser.uid)
  //   // .doc(this.user.uid);
  //   await updateDoc(userRef, (usr: DocumentData) => {
  //     this.currentUser.next(usr.get('firstname') + ' ' + usr.get('surname'));
  //   });
  // }

  signOut(): void {
    this.loading.next(true);
    this.loggedIn.next(false);
    this.currentUser.next('Log in');
    // this.route.navigateByUrl('/login');
    this.loading.next(false);
    this.auth.signOut();
  }

  public signIn(email: string, password: string): void {
    this.loading.next(true);
    // this.fireAuth.setPersistence('local');
    signInWithEmailAndPassword(this.auth, email, password)
			.then(() => {
				this.loggedIn.next(true);
				this.loading.next(false);
				this.route.navigateByUrl('/');
			})
			.catch(error => {
				window.alert(error.message);
				this.loading.next(false);
			});
  }

  // Creating new users without changing the admin auth state
  async addNewUser(mail: string, pass: string): Promise<string> {
    const tmpAuth = getAuth(this.userInit);
    const uid = await createUserWithEmailAndPassword(tmpAuth, mail, pass)
      .then((usr) => {
        return usr.user.uid;
      });
    tmpAuth.signOut();
    return uid;
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get currentUserID(): string {
    return this.auth.currentUser.uid;
  }
}
