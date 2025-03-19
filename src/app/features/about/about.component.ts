import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  user = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser$
      .subscribe((newuser) => {
        console.log('userService.currentUser$', newuser);
        if (newuser && newuser.id) {
          this.user = newuser;
        }
      });
  }

  // Add any methods that are specific to this component here
}
