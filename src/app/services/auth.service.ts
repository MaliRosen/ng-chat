import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
// signIn
// signOut
// isLogged
// save data locally

  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private afs:AngularFirestore, private afAuth: AngularFireAuth, private router : Router) {
    const saveUserString=localStorage.getItem('user');
    if(saveUserString!= null){
      this.isLoggedIn$.next(true);
    }
    afAuth.authState.subscribe((user)=> {
      if(!!user){
        debugger;
        this.isLoggedIn$.next(true);
        const userstring : string = JSON.stringify(user);
        localStorage.setItem("user", userstring);
      }
      else{
        this.isLoggedIn$.next(false);
        localStorage.removeItem("user");

      }
    })
   }

  public signInWithGoogle(){
    this.authLogin(new firebase.default.auth.GoogleAuthProvider())
  }

  public signOut(): Promise<void>{
    return this.afAuth.signOut().then(()=>{
      localStorage.removeItem("user");
       this.router.navigate(["/"]);
    })
  }
  private authLogin(provider:firebase.default.auth.AuthProvider){
    debugger;
    return this.afAuth.signInWithPopup(provider).then((res)=>{
    this.isLoggedIn$.next(true);
    this.setUserData(res.user as unknown as User);
    this.router.navigate(["chat"]);
  });
  }

  private setUserData(user?: User): Promise<void> | void {
    if (!user)return;
    const userRef : AngularFirestoreDocument<User> = this.afs.doc(
    `users/$(user.uid)`
    )

    const userData: User = {
      uid:user.uid,
      email:user.email,
      displayName:user.displayName,
      photoUrl:user.photoUrl
    }
    return userRef.set(userData,{merge:true})
  }

  public isLoggedIn():Observable<boolean> {
    debugger
    return this.isLoggedIn$.asObservable();
  }
}
