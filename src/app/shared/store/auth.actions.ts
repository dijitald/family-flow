import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";
import { AccountInfo } from "@azure/msal-browser";

//export const autoLogin = createAction('[Auth] Auto Login');
//export const signupStart = createAction('[Auth] Signup Start', props<{ payload: { email: string, password: string}}>());

export const signInStart = createAction('[Auth] Login Start');
export const signInSetActiveAccount = createAction('[Auth] Set Active Account', props<{ payload: AccountInfo }>());
export const signInComplete = createAction('[Auth] Login Complete', props<{ payload: User }>());
export const authenticateFailed = createAction('[Auth] Login Failed', props<{ payload: string }>());
export const logout = createAction('[Auth] Logout');
export const clearError = createAction('[Auth] Clear Error');
