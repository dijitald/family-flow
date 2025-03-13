import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, CustomMaterialModule, FlexLayoutModule]
})
export class LoginComponent implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.currentAuth$
      .pipe(takeUntil(this._destroying$))
      .subscribe((user) => {
        console.log('user', user);
        this.router.navigate(['/dashboard']);
      });
  }

  logIn() {
    this.authService.login();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}