import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    standalone: true,
    imports: [ RouterModule, CommonModule ],
})

export class FooterComponent {
    test: Date = new Date();
}
