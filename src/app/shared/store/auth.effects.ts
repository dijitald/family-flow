import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { authenticateComplete, authenticateFailed, autoLogin, logout, signInStart, signupStart } from "./auth.actions";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { AuthService } from "../auth.service";

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
    apiKey = 'AIzaSyBZR3OjHPNxoGxLPz8yjLVYTIAh_vGjink';
    signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+this.apiKey;
    signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+this.apiKey;

    constructor(private actions$: Actions, private store: Store, private http : HttpClient, private router: Router, private authSvc : AuthService) {} 

    authSignIn = createEffect(
        () => this.actions$.pipe(
            ofType(signInStart, signupStart),
            tap((authData) => {console.log('loginStart Effect', authData);}),
            switchMap((authData) => {
                let url = this.signInUrl;
                if (authData.type === signupStart.type) { url = this.signUpUrl;}

                return this.http.post<AuthResponseData>(url, {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }).pipe(
                    take(1),
                    tap(resData => { console.log('signIn/Up tap', resData);}),
                    map(resData => {
                        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                        const user = new User(resData.email,resData.localId, resData.idToken, expirationDate);
                        localStorage.setItem('userData', JSON.stringify(user));
                        this.authSvc.setLogoutTimer(+resData.expiresIn * 1000);
                        return authenticateComplete({payload: {user: user, redirect: true}});
                    }),
                    catchError((errorRes) => {
                      let errorMessage = 'An unknown error occurred!';
                      console.log('errorRes', errorRes.error.error.message);
                      if (!errorRes.error || !errorRes.error.error) {
                        return of(authenticateFailed({payload: errorMessage}));
                      }
                      switch (errorRes.error.error.message) {
                        case 'EMAIL_EXISTS':
                          errorMessage = 'This email exists already';
                          break;
                        case 'EMAIL_NOT_FOUND':
                          errorMessage = 'This email does not exist.';
                          break;
                        case 'INVALID_PASSWORD':
                          errorMessage = 'This password is not correct.';
                          break;
                          case 'INVALID_LOGIN_CREDENTIALS':
                            errorMessage = 'Invalid Login Credentials.';
                            break;
                        }
                      return of(authenticateFailed({ payload: errorMessage}));
                    })
         
                );
            })
        )
    );
    authRedirect = createEffect(
        () => this.actions$.pipe(
            ofType(authenticateComplete),
            tap((authData) => {
                console.log('authRedirect Effect', authData);
                if (authData.payload.redirect) {
                  this.router.navigate(['/recipes']);
              }
            }),
        ), 
        {dispatch: false}
    );
    authLogout = createEffect(
        () => this.actions$.pipe(
            ofType(logout),
            map((authData) => {
                console.log('logging out');
                this.authSvc.clearLogoutTimer();
                localStorage.removeItem('userData'); 
                this.router.navigate(['/auth']);
            }),
        ), 
        {dispatch: false}
    );
    authAutoLogIn = createEffect(
        () => this.actions$.pipe(
            ofType(autoLogin),
            map((authData) => {
                console.log('autoLogin');
                const userData : { email: string; userId: string; _token: string; _tokenExpiration: string } = JSON.parse(localStorage.getItem('userData'));
                if (!userData) { return logout();}
                const user = new User(userData.email, userData.userId, userData._token, new Date(userData._tokenExpiration));  
                if(user.token) { 
                  console.log('autoLogin success');
                  this.authSvc.setLogoutTimer(new Date(userData._tokenExpiration).getTime() - new Date().getTime());
                  return authenticateComplete({payload: {user: user, redirect: false}});
                }
                else {
                  return logout();
                }
            }),
        )
    );
}
