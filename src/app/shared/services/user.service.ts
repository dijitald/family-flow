import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { BehaviorSubject, Observable, Subject, filter, of, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { User } from '../models/user.model';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from '../store/auth.reducer';
import { signInComplete, logout, signInSetActiveAccount, signInStart } from '../store/auth.actions';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private _currentUser$: BehaviorSubject<fromAuth.State> = 
      new BehaviorSubject({authError: '', isLoggedIn: false, user: new User('', '', '', '', '', '', new Date()), loading: false});
      //new BehaviorSubject(null);
  
  constructor(
    private authService: MsalService, 
    private msalBroadcastService: MsalBroadcastService, 
    private store: Store<fromApp.AppState>,
  ) { }

  public ngOnInit(): void {
    console.log('userService init');
    this.authService.handleRedirectObservable().subscribe();

    // this.msalBroadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) => status === InteractionStatus.None),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe(() => {
    //     console.log('in progress. interaction status none. setting active account.')
    //     this.store.dispatch(signInSetActiveAccount({payload: this.authService.instance.getActiveAccount() }))
    //   })

    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      takeUntil(this._destroying$)
    )
    .subscribe((result: EventMessage) => {
      const payload = result.payload as AuthenticationResult;
      console.log('LOGIN SUCCESS', payload.account);
      this.store.dispatch(signInSetActiveAccount({payload: payload.account}));
      console.log('sending signin complete');
      this.store.dispatch(signInComplete({payload: this.loadUserFromDatastore(payload.account)}));
    });

    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS),
      takeUntil(this._destroying$)
    )
    .subscribe((result: EventMessage) => {
      const payload = result.payload as AuthenticationResult;
      console.log('LOGOUT SUCCESS', payload.account);
      this.store.dispatch(signInSetActiveAccount({payload: payload.account}));
      this.store.dispatch(logout());
    });

    this.store.select('auth').subscribe(authState => {
      this._currentUser$.next(authState);
    });

  }
  
  public loadUserFromDatastore(account: AccountInfo): User {
    const id = account.homeAccountId;
    let userData : User = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      userData = new User(
        account.homeAccountId, 
        account.name, 
        account.username,
        account.username,
        '',
        '',
        new Date(),
        );
        this.saveUserToDatastore(userData);
      }
      return userData;
  }
    
  public saveUserToDatastore(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  public get currentUser$(): Observable<fromAuth.State> {
    return this._currentUser$.asObservable();
  }
  
  login() {
    this.store.dispatch(signInStart());
  }

  logout() {
      this.store.dispatch(logout());
  }
  
  isLoggedIn(): Observable<boolean>
  {
      if ( this._currentUser$.value.isLoggedIn )
      {
          return of(true);
      }
      return of(false);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
