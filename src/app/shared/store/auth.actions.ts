import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";

export const signInStart = createAction('[Auth] Login Start', props<{ payload: { email: string, password: string}}>());
export const autoLogin = createAction('[Auth] Auto Login');
export const authenticateComplete = createAction('[Auth] Login Complete', props<{ payload: {user: User, redirect: boolean} }>());
export const authenticateFailed = createAction('[Auth] Login Failed', props<{ payload: string }>());
export const logout = createAction('[Auth] Logout');
export const signupStart = createAction('[Auth] Signup Start', props<{ payload: { email: string, password: string}}>());
export const clearError = createAction('[Auth] Clear Error');
