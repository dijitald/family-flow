import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromAuth from '../../shared/store/auth.reducer';
import { UserService } from '../../shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], 
  standalone: true,
  imports: [CommonModule, CustomMaterialModule]
})
export class ProfileComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  userState: fromAuth.State; 

  constructor(private userService: UserService) { }
  
  ngOnInit() {
    this.userService.currentUser$
//      .pipe(takeUntil(this._destroying$))
      .subscribe((user) => {
        if (user) this.userState = user;
      });

  }
  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
