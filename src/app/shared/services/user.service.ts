import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import * as fromAuth from './auth.service';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { MewmbershipService } from './membership.service';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private _currentUser$: BehaviorSubject<User> = new BehaviorSubject(undefined);

  constructor (
    private authService: fromAuth.AuthService,
    // private membershipService: MewmbershipService,
    private http: HttpClient,
  ) { }

  public ngOnInit(): void {
    console.log('UserService init');

    this.authService.currentAuth$
       .pipe(takeUntil(this._destroying$))
       .subscribe((auth) => {
           if (auth && auth.guid && auth.email && auth.name) {
            this.getUser(auth);
           }
       });

    // this.membershipService.household$
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((household) => {
    //     console.log('membershipService.household$', household);
    //     if (household)
    //       this._currentUser$.value.household = household;
    //   }
    // );
       
  }  

  public get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }
  
  public getUser(auth: Auth): void {
    console.log('getUser', auth);

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
        console.log("user loaded", user);
        if (user)
          this._currentUser$.next(user);
      },
      error: err => {
        console.error('Failed to get user:', err);          
      }
    });
  }

  public updateUser(user: User): void {
    console.log('updateUser', user);
    this.http.put<User>('/api/users', user, {responseType: 'json'})
      .subscribe({
        next: (user: User) => {
          if (user)
            this._currentUser$.next(user);
          else
            console.error('updateUser', 'empty response');
        },
        error: err => {
          console.error('Failed to update user:', err);
        }
      });
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
