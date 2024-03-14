import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';

import { User } from '../models/user.model';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
    private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    //public get currentUserObs() : Observable<User> { return this.currentUserSubject.asObservable()}
    public get currentUser(): User {return this.currentUserSubject.getValue()};
    private user: User = null;

    constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }
    
    public ngOnInit(): void {
        this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        )
        .subscribe((result: EventMessage) => {
          console.log('LOGIN SUCCESS', result);
          const payload = result.payload as AuthenticationResult;
          payload.
          this.authService.instance.setActiveAccount(payload.account);
        });
          
        this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS),
        )
        .subscribe((result: EventMessage) => {
          console.log('LOGOUT SUCCESS', result);
          const payload = result.payload as AuthenticationResult;
          this.authService.instance.setActiveAccount(payload.account);
        });

        // this.msalBroadcastService.inProgress$
        // .pipe(
        //   filter((status: InteractionStatus) => status === InteractionStatus.None)
        // )
        // .subscribe(() => {
        //   this.setLoginDisplay();
        // })
    }
    
    ngOnDestroy(): void {
        if (this.currentUserSubject)
            this.currentUserSubject.unsubscribe();
    }
}