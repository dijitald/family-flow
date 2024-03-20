import { AccountInfo } from "@azure/msal-browser";
import { createReducer, on } from "@ngrx/store";

import { User } from "../models/user.model";
import { signInComplete, authenticateFailed, clearError, logout } from "./auth.actions";

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

export const authReducer = createReducer(initialState,
    on(signInComplete, (state, action) => {
        console.log('login complete reducer', action);
        return {
            ...state,
            user: action.payload,
            authError: null,
            isLoggedIn: true,
            loading: false,
        }
    }),
    on(logout, (state) => {
        console.log('logout reducer');
        return {
            ...state,
            user: null,
            isLoggedIn: false,
        }
    }),
    on(authenticateFailed, (state, action) => {
        console.log('loginFailed reducer', action);
        return {
            ...state,
            user: null,
            authError: action.payload,
            isLoggedIn: false,
            loading: false
        }
    }),
    on(clearError, (state) => {
        console.log('clearing error reducer');
        return {
            ...state,
            authError: null,
        }
    })

);
