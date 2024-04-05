import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(UserService).isLoggedIn().pipe(
        switchMap((authenticated) =>
        {
            if ( !authenticated )
            {
                // Redirect to the sign-in page with a redirectUrl param
                // const redirectURL = state.url === '/' ? '' : `redirectURL=${state.url}`;
                const urlTree = router.parseUrl(`/`);
                return of(urlTree);
            }
            return of(true);
        }),
    );
};
