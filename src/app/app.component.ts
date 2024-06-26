import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  //styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [ RouterModule ]  
})
export class AppComponent implements OnInit {

  constructor(private userService: UserService) {  }

  ngOnInit() {
    this.userService.ngOnInit(); // hack: start this service to get the user's info
  }

}
