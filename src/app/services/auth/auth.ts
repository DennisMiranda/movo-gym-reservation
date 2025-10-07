import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, from } from 'rxjs';
import { GoogleAuthProvider } from 'firebase/auth';
import firebase from 'firebase/compat/app';
// Use methods from firebase/firestore to avoid:
// Expected first argument to collection() to be a CollectionReference,
// a DocumentReference or FirebaseFirestore
// https://github.com/angular/angularfire/issues/3435
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ROLE = {
  user: 'user',
  admin: 'admin',
} as const;

type Role = (typeof ROLE)[keyof typeof ROLE];

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role;
  createdAt?: Date;
  lastLogin?: Date;
  provider?: 'email' | 'google';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser.asObservable();

  private afAuth = inject(AngularFireAuth);
  private firestore = inject(Firestore);

  constructor() {
    // Escuchar cambios de autenticación
    this.afAuth.authState.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserData(firebaseUser);
        this._currentUser.next(user);
      } else {
        this._currentUser.next(null);
      }
    });
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  hasAdminRole() {
    return this.currentUser?.role === ROLE.admin;
  }

  // Obtener rol desde Firestore
  async getUserData(firebaseUser: firebase.User): Promise<User> {
    try {
      const docRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        data.role = data.role || 'user';
        return data;
      } else {
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: 'user',
        };
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: 'user',
      };
    }
  }

  // Login con email
  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  // Registro con email
  signup(email: string, password: string, displayName: string, role: 'user' | 'admin' = 'user') {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password).then(async (cred) => {
        const user = cred.user;
        if (!user) throw new Error('User creation failed');
        await setDoc(doc(this.firestore, `users/${user.uid}`), {
          uid: user.uid,
          email: user.email,
          displayName: displayName || user.email?.split('@')[0],
          role,
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: 'email',
        });
        return user;
      })
    );
  }

  // Login con Google
  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const cred = await this.afAuth.signInWithPopup(provider);
    const user = cred.user;
    if (!user) throw new Error('Google login failed');

    // Guardar en Firestore si no existe
    const docRef = doc(this.firestore, `users/${user.uid}`);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date(),
        provider: 'google',
      });
    }

    const currentUser = await this.getUserData(user);
    this._currentUser.next(currentUser);
    return currentUser;
  }

  // Logout
  logout() {
    return from(
      this.afAuth.signOut().then(() => {
        this._currentUser.next(null);
      })
    );
  }

  get currentUser(): User | null {
    return this._currentUser.value;
  }
}
