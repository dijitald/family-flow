import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import * as fromAuth from './auth.service';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private _currentUser$: BehaviorSubject<User> = new BehaviorSubject(undefined);
  // private _currentUser$: BehaviorSubject<User> = new BehaviorSubject({
  //   id: '',
  //   name: '',
  //   email: '',
  //   activehousehold: '',
  //   role: '',
  //   createdOn: new Date(),
  // });

  constructor (private authService: fromAuth.AuthService) { }

  public ngOnInit(): void {
    console.log('userService init');

    this.authService.currentAuth$
       .pipe(takeUntil(this._destroying$))
       .subscribe((auth) => {
           if (auth) {
            const user = this.loadUserFromDatastore(auth);
            this._currentUser$.next(user);
           }
       });
  }  

  public loadUserFromDatastore(auth: Auth): User {
    let userData : User = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      userData = new User(auth.userid, auth.name, auth.email, '', '', new Date());
      this.saveUserToDatastore(userData);
    }
    return userData;
  }

  public saveUserToDatastore(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  public get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }
  
  public login(): void {
    this.authService.login();
  }
  public logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
