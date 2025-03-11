import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subject, takeUntil } from 'rxjs';

import * as fromAuth from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    imports: [CommonModule, FlexLayoutModule, CustomMaterialModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  userState: fromAuth.State;
  message: string = '';

  constructor(private notificationService: NotificationService,
    private titleService: Title,
    private authService: fromAuth.AuthService,
    private http: HttpClient
    ) {
      this.http.get('/api/hw')
        .subscribe((resp: any) => this.message = resp.text);
  }

  ngOnInit() {
    this.titleService.setTitle('Family Flow - Dashboard');
    this.authService.currentUser$
      .pipe(takeUntil(this._destroying$))
      .subscribe((user) => {
        if (user) this.userState = user;
      });

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome!');
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
