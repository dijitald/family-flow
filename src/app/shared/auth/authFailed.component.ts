import { Component } from '@angular/core';

@Component({
    selector: 'app-auth-failed',
    standalone: true,
    template: `
        <div>
            <h2>Authentication Failed</h2>
            <p>Sorry, we couldn't authenticate you. Please try again.</p>
        </div>
    `,
    styles: [`
        div {
            text-align: center;
            margin-top: 20%;
        }
        h2 {
            color: red;
        }
    `]
})
export class AuthFailedComponent { }