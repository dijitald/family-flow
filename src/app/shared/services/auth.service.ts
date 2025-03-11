import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { User } from '../models/user.model';

export interface State {
    user: User;
    isLoggedIn: boolean;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    isLoggedIn: false,
    authError: '',
    loading: false
}


@Injectable({ providedIn: 'root'})
export class AuthService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private usePopUp: boolean = true;
  private _currentUser$: BehaviorSubject<State> = new BehaviorSubject({authError: '', isLoggedIn: false, user: new User('', '', '', '', '', '', new Date()), loading: false});
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
 //   private msalBroadcastService: MsalBroadcastService, 
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
    //   })

    // this.msalBroadcastService.msalSubject$
    // .pipe(
    //   filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
    //   takeUntil(this._destroying$)
    // )
    // .subscribe((result: EventMessage) => {
    //   const payload = result.payload as AuthenticationResult;
    //   const account = payload.account;
    //   console.log('LOGIN SUCCESS', account);
    //   console.log(this._currentUser$.value);
    // });

    // this.msalBroadcastService.msalSubject$
    // .pipe(
    //   filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS),
    //   takeUntil(this._destroying$)
    // )
    // .subscribe((result: EventMessage) => {
    //   const payload = result.payload as AuthenticationResult;
    //   const account = payload.account;
    //   console.log('LOGOUT SUCCESS', account);
    //   console.log(this._currentUser$.value);
    // });
}

login() {
    if (this.usePopUp) {
        let popUpRequest: PopupRequest = null;
        if (this.msalGuardConfig.authRequest){
            console.log('authrequest', this.msalGuardConfig.authRequest);
            popUpRequest = {...this.msalGuardConfig.authRequest} as PopupRequest;
        }
        console.log('popuprequest', popUpRequest);
        this.authService.loginPopup(popUpRequest)
            .subscribe((response: AuthenticationResult) => {
                this.setActiveAccount(response.account);
                console.log(this._currentUser$.value);          
            });

        // if (this.msalGuardConfig.authRequest){
        //     console.log('authrequest', this.msalGuardConfig.authRequest);
        //     this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        //     .subscribe((response: AuthenticationResult) => {
        //         this.setActiveAccount(response.account);
        //         console.log(this._currentUser$.value);          
        //     });
        // } else {
        //     console.log('authrequest', 'no auth request');
        //     this.authService.loginPopup()
        //         .subscribe((response: AuthenticationResult) => {
        //             this.setActiveAccount(response.account);
        //             console.log(this._currentUser$.value);          
        //         });
        // }
    } else {
        let redirRequest: RedirectRequest = null;
        if (this.msalGuardConfig.authRequest){
            console.log('authrequest', this.msalGuardConfig.authRequest);
            redirRequest = {...this.msalGuardConfig.authRequest} as RedirectRequest;
        }
        this.authService.loginRedirect(redirRequest);

        // if (this.msalGuardConfig.authRequest){
        //     console.log('authrequest', this.msalGuardConfig.authRequest);
        //     this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
        // } else {
        //     console.log('authrequest', 'no auth request');
        //     this.authService.loginRedirect();
        // }          
    }
}

logout() {
    localStorage.removeItem('userData'); 
    this._currentUser$.next({
        user: null,
        isLoggedIn: false,
        authError: '',
        loading: false
      });
      if (this.usePopUp) {
      this.authService.logoutPopup({ mainWindowRedirectUri: "/" });
    } else {
      this.authService.logoutRedirect();
    }
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

  private setActiveAccount(account: AccountInfo): void {
    let activeAccount = account;
       
    if (activeAccount) {
      this.authService.instance.setActiveAccount(activeAccount);
    }
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    console.log('getting user data from storage');
    this._currentUser$.next({
        user: this.loadUserFromDatastore(account),
        isLoggedIn: true,
        authError: '',
        loading: false
    });
  }

  public get currentUser$(): Observable<State> {
    return this._currentUser$.asObservable();
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
