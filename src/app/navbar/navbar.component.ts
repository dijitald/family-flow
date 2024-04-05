import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

import { ROUTES } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    standalone: true,
    imports: [ RouterModule ],
})
export class NavbarComponent {

    constructor(private location: Location) {}
    
    getTitle() {
      const listTitles: any[] = ROUTES.filter(listTitle => listTitle);
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
        for (let i = 0; i < listTitles.length; i++) {
            if (listTitles[i].type === "link" && listTitles[i].path === titlee) {
                return listTitles[i].title;
            } else if (listTitles[i].type === "sub") {
                for (let j = 0; j < listTitles[i].children.length; j++) {
                    let subtitle = listTitles[i].path + '/' + listTitles[i].children[j].path;
                    // console.log(subtitle)
                    // console.log(titlee)
                    if (subtitle === titlee) {
                        return listTitles[i].children[j].title;
                    }
                }
            }
        }
        return 'Dashboard';
    }
}
