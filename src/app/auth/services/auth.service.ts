import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken!: string
  constructor(private angularAuth: AngularFireAuth) { }

  get logged() {
    return this.angularAuth.authState.pipe(
      tap((user) => {
        if (user) {
          user.getIdToken().then((value) => (this.userToken = value));
        } else {
          this.userToken = '';
        }
      })
    );
  }

  signUp(email: string, password: string) {
    return from(this.angularAuth.createUserWithEmailAndPassword(email, password))
  }
  signIn(email: string, password: string) {
    return from(this.angularAuth.signInWithEmailAndPassword(email, password))
  }
  signOut() {
    return from(this.angularAuth.signOut());
  }

  getCurrentUser() {
    return from(this.angularAuth.currentUser)
  }

  isSuperAdmin() {
    return this.logged.pipe(
      switchMap(async (user) => {
        const token = await user?.getIdTokenResult()
        if (token?.claims['superAdmin']) {
          return true
        }
        return false
      }))
  }
}