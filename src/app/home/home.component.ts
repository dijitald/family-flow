import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as fromApp from '../shared/store/app.reducer';
import { State } from '../shared/store/auth.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], 
  standalone: true,
  imports: [CommonModule]  
})
export class HomeComponent implements OnInit {
  userState: State

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.store.select('auth').subscribe(authState => {
      this.userState = authState;
    });

  }
}