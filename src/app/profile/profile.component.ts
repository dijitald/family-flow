import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import * as fromApp from '../shared/store/app.reducer';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], 
  standalone: true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  user: User = new User("","","","","","", new Date());

  constructor(private store: Store<fromApp.AppState>) { }
  
  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      if (authState.user)
        this.user = authState.user;
    });
  }
}
