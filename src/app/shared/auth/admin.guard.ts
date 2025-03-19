import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        console.log('AdminGuard: canActivate called');
        console.log('AdminGuard: route', route);
        console.log('AdminGuard: state', state);
        if (this.authService.isLoggedIn()) {
            console.log('AdminGuard: user is logged in');
            //check if the user has admin role?
            return true;
        } else {
            this.authService.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }
}

// export const AdminGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
// {
//     const router: Router = inject(Router); ////how to handle this, observable userstate? 

//     // Check the authentication status
//     return inject(UserService).isLoggedIn().pipe(
//         switchMap((authenticated) =>
//         {
//             const userState = this.userSvc.getCurrentUser();

//             if (userState && userState.user.role === 'admin') {
//                 return of(true);
    
//             } else {
//                 return of(router.parseUrl(`/`));
//             }
//         }),
//     );
// };
