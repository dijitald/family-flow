import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import * as fromAuth from './auth.service';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private _currentUser$: BehaviorSubject<User> = new BehaviorSubject(undefined);

  constructor (
    private authService: fromAuth.AuthService,
    private http: HttpClient,
  ) { }

  public ngOnInit(): void {
    console.log('UserService init');

    this.authService.currentAuth$
       .pipe(takeUntil(this._destroying$))
       .subscribe((auth) => {
           if (auth && auth.guid && auth.email && auth.name) {
            this.loadUser(auth);
           }
       });
  }  

  public loadUser(auth: Auth): void {
    console.log('loadUser', auth);
    let user : User = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      console.log(user);
      this._currentUser$.next(user);
    } else if (!user) {
      console.log('loading user from service', auth);

      this.http.get<User>('/api/users', {
        headers : {
          "guid" : auth.guid,
          "email" : auth.email,
          "name" : auth.name,
        }, 
        responseType: 'json',
      })
      .subscribe({
        next: (user: User) => {
          console.log(user);
          this.saveUserLocally(user);
          this._currentUser$.next(user);
        },
        error: err => {
          console.error('Failed to get user:', err);          
        }
      });
    }
  }

  public saveUserLocally(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  public get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }
  
  public login(): void {
    this.authService.login();
  }
  public logout(): void {
    localStorage.removeItem('userData'); 
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
