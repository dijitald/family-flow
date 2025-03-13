import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { FlexLayoutModule } from "ngx-flexible-layout";
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';


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
    user: User;
  
    constructor(
        private userService: UserService,
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

        this.userService.currentUser$
        .pipe(takeUntil(this._destroying$))
        .subscribe((newuser) => {
          if (newuser) this.user = newuser;
        });
    }    
    logIn() {
        this.userService.login();
    }
    logOut() {
        this.userService.logout();
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
