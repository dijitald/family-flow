import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    imports: [RouterModule]
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private userService: UserService) {  }

  ngOnInit() {
    this.authService.ngOnInit(); // hack: start this service to get the user's info
    this.userService.ngOnInit(); // hack: start this service to get the user's info
  }

}
