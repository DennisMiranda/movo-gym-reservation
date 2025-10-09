import { inject, Injectable, signal, computed } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, from, map, take } from 'rxjs';
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
  private afAuth = inject(AngularFireAuth);
  private firestore = inject(Firestore);

  // User signal
  private userSignal = signal<User | null>(this.loadUserFromStorage());
  user = computed(() => this.userSignal());
  isAdmin = computed(() => this.userSignal()?.role === 'admin');
  isLoggedIn = computed(() => !!this.userSignal());

  constructor() {
    // Firebase Auth State
    this.afAuth.authState.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserData(firebaseUser);
        this.setUser(user);
      } else {
        this.clearUser();
      }
    });
  }

  // Save user on Localstorage
  private setUser(user: User) {
    this.userSignal.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear user from Localstorage
  private clearUser() {
    this.userSignal.set(null);
    localStorage.removeItem('user');
  }

  // Load user from Localstorage
  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  // Authentication Methods

  // Email Login
  login(email: string, password: string) {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password).then(async (cred) => {
        if (!cred.user) throw new Error('Login failed');
        const user = await this.getUserData(cred.user);
        this.setUser(user);
        return user;
      })
    );
  }

  // Email Signup
  signup(email: string, password: string, displayName: string, role: Role = 'user') {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password).then(async (cred) => {
        const user = cred.user;
        if (!user) throw new Error('User creation failed');

        const newUser: User = {
          uid: user.uid,
          email: user.email,
          displayName: displayName || user.email?.split('@')[0] || null,
          role,
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: 'email',
        };

        await setDoc(doc(this.firestore, `users/${user.uid}`), newUser);
        this.setUser(newUser);
        return newUser;
      })
    );
  }

  //  Google Login
  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const cred = await this.afAuth.signInWithPopup(provider);
    const user = cred.user;
    if (!user) throw new Error('Google login failed');

    const docRef = doc(this.firestore, `users/${user.uid}`);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
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
    this.setUser(currentUser);
    return currentUser;
  }

  // Logout
  logout() {
    return from(
      this.afAuth.signOut().then(() => {
        this.clearUser();
      })
    );
  }

  // Obtener datos del usuario desde Firestore
  async getUserData(firebaseUser: firebase.User): Promise<User> {
    try {
      const docRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        data.role = data.role || 'user';
        return data;
      }

      // Usuario nuevo sin documento
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: 'user',
      };
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
}
