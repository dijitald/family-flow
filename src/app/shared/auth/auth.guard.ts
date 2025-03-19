import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    console.log('AuthGuard: called');
    console.log('AuthGuard: route', route);
    console.log('AuthGuard: state', state);

    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).isLoggedIn().pipe(
        switchMap((authenticated) =>
        {
            if ( !authenticated )
            {
                // const redirectURL = state.url === '/' ? '' : `${state.url}`;
                const redirectURL = state.url === '/' ? '' : `${route.routeConfig.path}`;
                console.log("AuthGuard: User is not authenticated, redirect: ", redirectURL);
                return of(router.parseUrl(`/login?redirectURL=${redirectURL}`));
            }
            console.log("AuthGuard: User IS authenticated");
            return of(true);
        }),
    );
};
