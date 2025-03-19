import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Auth } from '../models/auth.model';


@Injectable({ providedIn: 'root'})
export class AuthService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  redirectUrl: string | null = null;
  private usePopUp: boolean = true;
  private _currentLogin$: BehaviorSubject<Auth> = new BehaviorSubject({
      guid:'',  
      name:'', 
      email:'', 
      isLoggedIn: false, 
      authError: '', 
      loading: false
    });
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
  ) { }

  public ngOnInit(): void {
    console.log('AuthService init');
    this.msalService.handleRedirectObservable().subscribe();

    // this.msalService.initialize();
    // this.msalService.instance.handleRedirectPromise().then((response) => {
    //   if (response) {
    //     this.setActiveAccount(response.account);
    //   }
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
          this.msalService.loginPopup(popUpRequest)
              .subscribe((response: AuthenticationResult) => {
                  this.setActiveAccount(response.account);
                  console.log("AuthService", this._currentLogin$.value);          
              });
      } else {
          let redirRequest: RedirectRequest = null;
          if (this.msalGuardConfig.authRequest){
              console.log('authrequest', this.msalGuardConfig.authRequest);
              redirRequest = {...this.msalGuardConfig.authRequest} as RedirectRequest;
          }
          this.msalService.loginRedirect(redirRequest);
      }
  }

  logout() {
      this._currentLogin$.next(undefined);
      if (this.usePopUp) {
        this.msalService.logoutPopup({ mainWindowRedirectUri: "/" });
      } else {
        this.msalService.logoutRedirect();
      }
  }

  private setActiveAccount(activeAccount: AccountInfo): void {       
    if (activeAccount) {
      this.msalService.instance.setActiveAccount(activeAccount);
    }
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      let accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
    this._currentLogin$.next({
        guid: activeAccount.homeAccountId,
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
      else if ( this.msalService.instance.getActiveAccount())
      {
          const activeAccount = this.msalService.instance.getActiveAccount();
          this.setActiveAccount(activeAccount);
          return of(true);
      }
      return of(false);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
