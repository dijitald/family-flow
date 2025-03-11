import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).isLoggedIn().pipe(
        switchMap((authenticated) =>
        {
            if ( !authenticated )
            {
                // Redirect to the sign-in page with a redirectUrl param
                // const redirectURL = state.url === '/' ? '' : `redirectURL=${state.url}`;
                return of(router.parseUrl(`/`));
            }
            return of(true);
        }),
    );
};
