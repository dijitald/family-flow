import { createReducer, on } from "@ngrx/store";
import { User } from "../../user.model";
import { authenticateComplete, authenticateFailed, clearError, signInStart, logout } from "./auth.actions";

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
    on(authenticateComplete, (state, action) => {
        console.log('login complete reducer', action);
        return {
            ...state,
            user: action.payload.user,
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
    on(signInStart, (state, action) => {
        console.log('loginStart reducer', action);
        return {
            ...state,
            authError: null,
            loading: true
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
