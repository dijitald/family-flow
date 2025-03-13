import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Auth } from '../models/auth.model';


@Injectable({ providedIn: 'root'})
export class AuthService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private usePopUp: boolean = true;
  private _currentLogin$: BehaviorSubject<Auth> = new BehaviorSubject({
      userid:'',  
      name:'', 
      email:'', 
      isLoggedIn: false, 
      authError: '', 
      loading: false
    });
  
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
                console.log("AuthService", this._currentLogin$.value);          
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
    //localStorage.removeItem('userData'); 
    this._currentLogin$.next(undefined);
    if (this.usePopUp) {
      this.authService.logoutPopup({ mainWindowRedirectUri: "/" });
    } else {
      this.authService.logoutRedirect();
    }
}

  private setActiveAccount(activeAccount: AccountInfo): void {       
    if (activeAccount) {
      this.authService.instance.setActiveAccount(activeAccount);
    }
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    console.log('getting user data from storage');
    this._currentLogin$.next({
        userid: activeAccount.homeAccountId,
        name: activeAccount.name,
        email: activeAccount.username,
        isLoggedIn: true,
        authError: '',
        loading: false
    });
  }

  public get currentAuth$(): Observable<Auth> {
    return this._currentLogin$.asObservable();
  }
  
  isLoggedIn(): Observable<boolean>
  {
      if ( this._currentLogin$.value.isLoggedIn )
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
