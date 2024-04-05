import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../shared/store/app.reducer';
import * as fromAuth from '../shared/store/auth.reducer';
import { logout, signInStart } from '../shared/store/auth.actions';
import { MatMenuModule } from '@angular/material/menu';
import * as fromRoutes from '../app.routes';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: '/user', title: 'User Profile',  icon:'pe-7s-user', class: '' },
    { path: '/table', title: 'Table List',  icon:'pe-7s-note2', class: '' },
    { path: '/typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    { path: '/icons', title: 'Icons',  icon:'pe-7s-science', class: '' },
    { path: '/maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html', 
  // templateUrl: './sidetest.html', 
  standalone: true,
  imports: [ RouterModule, CommonModule, SidebarComponent, MatMenuModule],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  userState:  fromAuth.State

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.menuItems = fromRoutes.routes.filter(menuItem => menuItem);
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    // this.activatedroute.data.subscribe(data => {
    //   this.product=data;
    // });
    this.store.select('auth').subscribe(authState => {
      this.userState = authState;
    });

  }
  isMobileMenu() {
      if (window.innerWidth > 991) {
          return false;
      }
      return true;
  };

  login() {
    this.store.dispatch(signInStart());
  }

  logout() {
      this.store.dispatch(logout());
  }    
  }

