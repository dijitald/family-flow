import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { Subject, filter } from 'rxjs';
import { Store } from '@ngrx/store';

import { User } from '../models/user.model';
import * as fromApp from '../store/app.reducer';
import { signInComplete, logout, signInSetActiveAccount } from '../store/auth.actions';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private authService: MsalService, 
    private msalBroadcastService: MsalBroadcastService, 
    private store: Store<fromApp.AppState>,
  ) { }
  
  public ngOnInit(): void {
    console.log('userService init');
    this.authService.handleRedirectObservable().subscribe();

    // this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
    //   )
    //   .subscribe((result: EventMessage) => {
    //     console.log('account added/removed', result.payload);
    //     if (this.authService.instance.getAllAccounts().length === 0) {
    //       this.store.dispatch(logout())
    //     } else {
    //       this.store.dispatch(signInSetActiveAccount({payload: this.authService.instance.getActiveAccount() }))
    //     }
    //   });
    
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
    )
    .subscribe((result: EventMessage) => {
      const payload = result.payload as AuthenticationResult;
      console.log('LOGIN SUCCESS', payload.account);
      this.store.dispatch(signInSetActiveAccount({payload: payload.account}));
      console.log('sending signin complete');
      this.store.dispatch(signInComplete({payload: this.loadUser(payload.account)}));
    });

    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS),
    )
    .subscribe((result: EventMessage) => {
      const payload = result.payload as AuthenticationResult;
      console.log('LOGOUT SUCCESS', payload.account);
      this.store.dispatch(signInSetActiveAccount({payload: payload.account}));
      this.store.dispatch(logout());
    });
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }


  public loadUser(account: AccountInfo): User {
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
        this.saveUser(userData);
      }
      return userData;
  }

  public saveUser(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

}
