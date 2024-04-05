import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { UserService } from '../../shared/services/user.service';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], 
  standalone: true,
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule]  
})
export class HomeComponent implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
    console.log('home init', this.userService.currentUser$);
    this.userService.currentUser$
 //   .pipe(takeUntil(this._destroying$), tap((user) => console.log('user', user)))
    .subscribe((user) => {
      console.log('user', user);
      this.router.navigate(['/dashboard']);
    });
  }

  logIn() {
    this.userService.login();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}