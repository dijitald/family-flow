import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { Membership } from '../models/membership.model';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root'})
export class MewmbershipService implements OnInit, OnDestroy{
  private readonly _destroying$ = new Subject<void>();
  private _household$: BehaviorSubject<Membership> = new BehaviorSubject(undefined);
  private _households$: BehaviorSubject<Membership[]> = new BehaviorSubject(undefined);

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) { }
    ngOnInit(): void {
        console.log('MembershipService init');

        // this.userService.currentUser$
        //     .pipe(takeUntil(this._destroying$))
        //     .subscribe((newuser) => {
        //         console.log('userService.currentUser$', newuser);
        //         if (newuser && newuser.id) {
        //             this.getMemberships(newuser);
        //         }
        //     });
    }

    // public get household$(): Observable<Membership> {
    //     return this._household$.asObservable();
    // }
    // public get households(): Observable<Membership[]> {
    //     return this._households$.asObservable();
    // }
    // public getMemberships(user: User): void {
    //     console.log('getMemberships', user);

    //     this.http.get<Membership[]>('/api/memberships', {
    //         headers: {
    //             "uid": user.id
    //         },
    //         responseType: 'json'
    //     })
    //     .subscribe({
    //         next: (households) => {
    //             console.log("getMemberships", households);
    //             if (households && households.length > 0) {
    //                 this._households$.next(households);
    //                 console.log("got further", households);
    //                 //this._household$.next(households.find((membership) => membership.household.id === user.householdid));
    //             }
    //         },
    //         error: err => {
    //             console.error('Failed to get memberships:', err);
    //         }
    //     });
    // }
    // public getMembership(houseid: string, userid: string): Observable<Membership> {
    //     return this.http.get<Membership>('/api/memberships', {
    //         headers: {
    //             "hid": houseid,
    //             "uid": userid
    //         },
    //         responseType: 'json'
    //     }).pipe(
    //         tap((member: Membership) => {
    //             console.log(member);
    //             this._currentHousehold$.next(member);
    //         }),
    //         catchError(err => {
    //             console.error('Failed to get membership:', err);
    //             return throwError(() => new Error(err));
    //         })
    //     );
    // }
    // public addMembership(houseid: string, userid: string): Observable<Membership> {
    //     return this.http.post<Membership>('/api/memberships', { "hid" : houseid, "uid": userid }, {responseType: 'json'}).pipe(
    //         tap((house: Membership) => {
    //             console.log("addMembership", house);
    //             if (house) 
    //                 this._household$.next(house);
    //             else
    //                 console.error('addMembership', 'empty response');
    //         }),
    //         catchError(err => {
    //             console.error('Failed to create membership:', err);
    //             return throwError(() => new Error(err));
    //         })
    //     );
    // }
    // public updateMembership(membership: Membership): Observable<Membership> {
    //     return this.http.put<Membership>('/api/memberships', membership, {responseType: 'json'}).pipe(
    //         tap((house: Membership) => {
    //             console.log(house);
    //             this._household$.next(house);
    //         }),
    //         catchError(err => {
    //             console.error('Failed to update membership:', err);
    //             return throwError(() => new Error(err));
    //         })
    //     );
    // }
    // public deleteMembership(membership: Membership): Observable<Membership> {
    //     return this.http.delete<Membership>('/api/memberships', {
    //         headers: {
    //             "hid": membership.householdid,
    //             "uid": membership.userid.toString()
    //         },    
    //             responseType: 'json'
    //     }).pipe(
    //         tap((house: Membership) => {
    //             console.log("deleteMembership", house);
    //             // this._household$.next(house);
    //         }),
    //         catchError(err => {
    //             console.error('Failed to delete membership:', err);
    //             return throwError(() => new Error(err));
    //         })
    //     );
    // }

    ngOnDestroy(): void {
        this._destroying$.next();
        this._destroying$.complete();
    }
}
