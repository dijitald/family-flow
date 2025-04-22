import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { NotificationService } from '../../shared/services/notification.service';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { HttpClient } from '@angular/common/http';
import { TaskListComponent } from "../task-list/task-list.component";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    imports: [CommonModule, FlexLayoutModule, CustomMaterialModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  user: User;
  message: string = '';

  constructor(private notificationService: NotificationService,
    private titleService: Title,
    private userService: UserService,
    private http: HttpClient
    ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Family Flow - Dashboard');
   
    this.userService.currentUser$
      .pipe(takeUntil(this._destroying$))
      .subscribe((newuser) => {
        if (newuser) this.user = newuser;
      });

    this.http.get('/api/ping', {responseType: 'text'})
      .subscribe((resp: any) => { 
        console.log(resp);
        this.message = resp;
      }
    );

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome!');
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
