import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { MsalService } from '@azure/msal-angular';

@Component({
    selector: 'app-home',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, CustomMaterialModule, FlexLayoutModule]
})
export class LoginComponent implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  constructor(private userService:UserService, private router: Router, private authService: AuthService, private msalService: MsalService
  ) { }
  
  ngOnInit() {
    console.log('LoginComponent: ngOnInit');

    // this.msalService.instance.handleRedirectPromise().then((response) => {
    //   if (response) {
    //     console.log('handleRedirectPromise', response);
    //     this.msalService.instance.setActiveAccount(response.account);
    //   }
    // });

    if (this.msalService.instance.getActiveAccount()) {
      console.log('active account set. redirecting');

      //check the query string params for a redirectURL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectURL = urlParams.get('redirectURL');
      if (redirectURL) {
        console.log('redirecting to', redirectURL);
        this.router.navigate([redirectURL]);
      }
      else {
        console.log('redirecting to dashboard');
        this.router.navigate(['/dashboard']);
      }
    } else {
      console.log('no active account set. waiting for login');
      this.userService.currentUser$
        .pipe(takeUntil(this._destroying$))
        .subscribe((user) => {
          console.log('userService.currentUser$', user);
          if (user) {
            if (!user.lastLogon) {
              console.log('redirecting to profile');
              this.router.navigate(['/profile']);
            } else if (this.authService.redirectUrl) {
              console.log('redirecting to', this.authService.redirectUrl);
              this.router.navigate([this.authService.redirectUrl]);
              this.authService.redirectUrl = null;
            } else {
              console.log('redirecting to dashboard');
              this.router.navigate(['/dashboard']);
            }
          }
        });
    }
  }

  logIn() {
    this.userService.login();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}