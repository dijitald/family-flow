import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
//import { UserService } from '../services/user.service';

// @Injectable()
// export class AdminGuard implements CanActivate {

//     constructor(private router: Router,
//         private userSvc: UserService) { }

//     canActivate() {
//         const userState = this.userSvc.getCurrentUser();

//         if (userState && userState.user.role === 'admin') {
//             return true;

//         } else {
//             this.router.navigate(['/']);
//             return false;
//         }
//     }
// }

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
