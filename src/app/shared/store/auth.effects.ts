import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, PopupRequest, RedirectRequest } from "@azure/msal-browser";
import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { logout, signInComplete, signInSetActiveAccount, signInStart } from "./auth.actions";
import { UserService } from "../services/user.service";
import * as fromApp from '../store/app.reducer';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
  }  

@Injectable()
export class AuthEffects {
  private usePopUp: boolean = true;

  constructor(
    private actions$: Actions, 
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService, 
    private userService: UserService,
    private store: Store<fromApp.AppState>,
    ) {} 

  authSignIn = createEffect(
      () => this.actions$.pipe(
        ofType(signInStart),
        tap((authData) => {console.log('signInStart Effect', authData);}),
        map(() => {
          if (this.usePopUp) {
            if (this.msalGuardConfig.authRequest){
              console.log('authrequest', this.msalGuardConfig.authRequest);
              this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
                .subscribe((response: AuthenticationResult) => {
                  this.store.dispatch(signInSetActiveAccount({payload: response.account}));
                  this.store.dispatch(signInComplete({payload: this.userService.loadUser(response.account)}));
                  //this.authService.instance.setActiveAccount(response.account);
                });
              } else {
              console.log('authrequest', 'no auth request');
                this.authService.loginPopup()
                  .subscribe((response: AuthenticationResult) => {
                  this.store.dispatch(signInSetActiveAccount({payload: response.account}));
                  this.store.dispatch(signInComplete({payload: this.userService.loadUser(response.account)}));
                  //this.authService.instance.setActiveAccount(response.account);
              });
            }
          }
          else {
            if (this.msalGuardConfig.authRequest){
              console.log('authrequest', this.msalGuardConfig.authRequest);
              this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
            } else {
              console.log('authrequest', 'no auth request');
              this.authService.loginRedirect();
            }          
          }
        })
      ), 
      {dispatch: false}
  );

  authSetActiveAccount = createEffect(
    () => this.actions$.pipe(
      ofType(signInSetActiveAccount),
      tap((authData) => {console.log('authSetActiveAccount Effect', authData);}),
      map((authData) => {
        let activeAccount = authData.payload;
       
        if (activeAccount) {
          this.authService.instance.setActiveAccount(activeAccount);
        }
        if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
          let accounts = this.authService.instance.getAllAccounts();
          this.authService.instance.setActiveAccount(accounts[0]);
        }
      })
    ),
    {dispatch: false}
  );

  authLogout = createEffect(
    () => this.actions$.pipe(
      ofType(logout),
      map(() => {
        console.log('logout effect');
        localStorage.removeItem('userData'); 
        if (this.usePopUp) {
          this.authService.logoutPopup({ mainWindowRedirectUri: "/" });
        } else {
          this.authService.logoutRedirect();
        }
      }),
    ), 
    {dispatch: false}
  );
}
