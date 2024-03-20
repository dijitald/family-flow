import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import * as fromApp from './shared/store/app.reducer';
import { logout, signInStart } from './shared/store/auth.actions';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatMenuModule],
})
export class AppComponent implements OnInit {
  title = 'Family Flow';
  isIframe = false;
  userIsLoggedIn = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    this.userService.ngOnInit();
    this.store.select('auth').subscribe(authState => {
      this.userIsLoggedIn = authState.isLoggedIn;
    });
  }

  login() {
    this.store.dispatch(signInStart());
  }
  
  logout() {
    this.store.dispatch(logout());
  }
}
