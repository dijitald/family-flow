import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { FlexLayoutModule } from "ngx-flexible-layout";

import * as fromAuth from '../../shared/services/auth.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
    imports: [CommonModule, RouterModule, FlexLayoutModule, CustomMaterialModule]
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    private readonly _destroying$ = new Subject<void>();
  
    title = 'Family Flow - the heartbeat of the home';
    isIframe = false;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userState: fromAuth.State;
  
    constructor(
        private authService: fromAuth.AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public spinnerService: SpinnerService,
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        //this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.isIframe = window !== window.parent && !window.opener; 

        this.authService.currentUser$
           .pipe(takeUntil(this._destroying$))
           .subscribe((user) => {
                if (user) this.userState = user;
                console.log('user', user);
           });
    }
    logIn() {
        this.authService.login();
    }
    logOut() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        //this.mobileQuery.removeListener(this._mobileQueryListener);
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }
}
