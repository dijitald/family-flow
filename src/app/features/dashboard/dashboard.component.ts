import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { Title } from '@angular/platform-browser';

import * as fromAuth from '../../shared/store/auth.reducer';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { UserService } from '../../shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    imports: [CommonModule, FlexLayoutModule, CustomMaterialModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  userState: fromAuth.State;

  constructor(private notificationService: NotificationService,
    private titleService: Title,
    private userService: UserService,
    ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Family Flow - Dashboard');
    this.userService.currentUser$
      .pipe(takeUntil(this._destroying$))
      .subscribe((user) => {
        this.userState = user;
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
