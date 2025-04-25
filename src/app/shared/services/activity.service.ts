import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService implements OnInit, OnDestroy {
    private readonly _destroying$ = new Subject<void>();

    constructor(
        private http: HttpClient,
    ) { }

    public ngOnInit(): void {
        console.log('ActivityService init');
    }
  
    //   public get_activity(id: string): void {
    //     console.log('loading activity from service', id);
        
    //     this.http.get<Activity>('/api/activities', { headers : { "id": id }, responseType: 'json' })
    //     .subscribe((resp: Activity) => {
    //         console.log(resp);
    //     });
    //   }

    public get_user_activities(uid: number): Observable<Activity> {
        console.log('loading user activities from service', uid);
        return this.get_activities({ headers : { 'uid': uid }, responseType: 'json' });
    }
    public get_household_activities(hid: number): Observable<Activity> {
        console.log('loading household activities from service', hid);
        return this.get_activities({ headers : { 'hid': hid }, responseType: 'json' });
    }
    public get_activities(header: any): Observable<Activity> {
        return this.http.post<Activity>('/api/activities', header).pipe(
            tap((act: Activity) => {
            console.log("got activities [%s]", act);
            }),
            catchError(err => {
            console.error('Failed to get activities:', err);
            return throwError(() => new Error(err));
            })
        );
    }

    public create_activity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>('/api/activities', activity, {responseType: 'json'}).pipe(
        tap((act: Activity) => {
        console.log("create_activity", act);
        }),
        catchError(err => {
        console.error('Failed to create activity:', err);
        return throwError(() => new Error(err));
        })
    );
    }

    public update_activity(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>('/api/activities', activity, {responseType: 'json'}).pipe(
        tap((act: Activity) => {
        console.log(act);
        }),
        catchError(err => {
        console.error('Failed to update activity:', err);
        return throwError(() => new Error(err));
        })
    );
    }
    public delete_activity(activity: Activity): Observable<Activity> {
      return this.http.delete<Activity>('/api/activities', { headers : { 'id': activity.id.toString() }, responseType: 'json' }).pipe(
        tap((act: Activity) => {
        console.log("delete_activity", act);
        }),
        catchError(err => {
        console.error('Failed to delete activity:', err);
        return throwError(() => new Error(err));
        })
      );
    }

    ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    }
}