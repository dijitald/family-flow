import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import * as fromAuth from './auth.service';
//import { User } from '../models/user.model';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
//  private userState: fromAuth.State;

  constructor(
    private authService: fromAuth.AuthService, 
  ) { }

  public ngOnInit(): void {
    console.log('userService init');
  //  this.authService.currentUser$
  //      .pipe(takeUntil(this._destroying$))
  //      .subscribe((user) => {
  //          if (user) this.userState = user;
  //      });
  }  

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
