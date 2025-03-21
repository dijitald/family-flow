import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import * as fromAuth from './auth.service';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
// import { MewmbershipService } from './membership.service';
import { Membership } from '../models/membership.model';

@Injectable({ providedIn: 'root'})
export class UserService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private _currentUser$: BehaviorSubject<User> = new BehaviorSubject(undefined);

  constructor (
    private authService: fromAuth.AuthService,
    private http: HttpClient,
  ) { }

  public ngOnInit(): void {
    console.log('UserService init');

    this.authService.currentAuth$
       .pipe(takeUntil(this._destroying$))
       .subscribe((auth) => {
           if (auth && auth.guid && auth.email && auth.name) {
            this.getUser(auth);
           }
       });
  }  
  public get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }

  public getUser(auth: Auth): void {
    console.log('getUser', auth);

    this.http.get<User>('/api/users', {
      headers : {
        "guid" : auth.guid,
        "email" : auth.email,
        "name" : auth.name,
      }, 
      responseType: 'json',
    })
    .subscribe({
      next: (user: User) => {
        console.log("user loaded", user);
        if (user)
          this._currentUser$.next(user);
      },
      error: err => {
        console.error('Failed to get user:', err);          
      }
    });
  }
  public updateUser(user: User): void {
    console.log('updateUser', user);
    this.http.put<User>('/api/users', user, {responseType: 'json'})
      .subscribe({
        next: (user: User) => {
          if (user)
            this._currentUser$.next(user);
          else
            console.error('updateUser', 'empty response');
        },
        error: err => {
          console.error('Failed to update user:', err);
        }
      });
  }

  public addMembership(houseid: string, userid: string): Observable<Membership> {
    return this.http.post<Membership>('/api/memberships', { "hid" : houseid, "uid": userid }, {responseType: 'json'}).pipe(
        tap((member: Membership) => {
            console.log("addMembership", member);
            if (member) {
              if (!this._currentUser$.value.households) this._currentUser$.value.households = []; 
              this._currentUser$.value.households.push(member);
              this._currentUser$.value.householdid = houseid;
              this._currentUser$.next(this._currentUser$.value);
            }
            else
                console.error('addMembership', 'empty response');
        }),
        catchError(err => {
            console.error('Failed to create membership:', err);
            return throwError(() => new Error(err));
        })
    );
  }
  public updateMembership(membership: Membership): Observable<Membership> {
    console.log("updateMembership", membership);
    return this.http.put<Membership>('/api/memberships', membership, {responseType: 'json'}).pipe(
          tap((mem: Membership) => {
              console.log("updateMembership completed", mem);
              this._currentUser$.value.households.find(m => m.householdid === membership.householdid).balance = membership.balance;
              this._currentUser$.next(this._currentUser$.value);
            }),
          catchError(err => {
              console.error('Failed to update membership:', err);
              return throwError(() => new Error(err));
          })
      );
  }
  public deleteMembership(membership: Membership): Observable<Membership> {
    console.log('deleteMembership', membership);
    return this.http.delete<Membership>('/api/memberships', {
          headers: {
              "hid": membership.householdid,
              "uid": membership.userid.toString()
          },    
              responseType: 'json'
      }).pipe(
          tap(() => {
              console.log("deleteMembership completed");
              this._currentUser$.value.households = this._currentUser$.value.households.filter(m => m.householdid !== membership.householdid);
              if (this._currentUser$.value.householdid === membership.householdid) {
                this._currentUser$.value.householdid = this._currentUser$.value.households[0]?.householdid;
                this.updateUser(this._currentUser$.value);
              }
              else
                this._currentUser$.next(this._currentUser$.value);
            }),
          catchError(err => {
              console.error('Failed to delete membership:', err);
              return throwError(() => new Error(err));
          })
      );
  }


  public login(): void {
    this.authService.login();
  }
  public logout(): void {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
