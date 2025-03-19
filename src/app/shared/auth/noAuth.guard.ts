import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).isLoggedIn().pipe(
        switchMap((authenticated) =>
        {
            console.log('NoAuthGuard', authenticated);
            if ( authenticated )
            {
                console.log("NoAuthGuard: User is authenticated. sending them to root");
                return of(router.parseUrl(''));
            }

            // Allow the access
            return of(true);
        }),
    );
};
