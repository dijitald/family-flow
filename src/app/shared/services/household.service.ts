import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Household } from '../models/household.model';

@Injectable({ providedIn: 'root' })
export class HouseholdService implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private http: HttpClient, // Inject HttpClient
  ) { }

  public ngOnInit(): void {
    console.log('HouseholdService init');
  }
  
  // public get_household(id: string): void {
  //   console.log('loading household from service', id);
    
  //   this.http.get<Household>('/api/households', { headers : { "id": id }, responseType: 'json' })
  //   .subscribe((resp: Household) => {
  //       console.log(resp);
  //   });
  // }

  public create_household(name: string): Observable<Household> {
    return this.http.post<Household>('/api/households', { "name" : name }, {responseType: 'json'}).pipe(
      tap((house: Household) => {
        console.log("create_household", house);
      }),
      catchError(err => {
        console.error('Failed to create household:', err);
        return throwError(() => new Error(err));
      })
    );
  }

  public update_household(household: Household): Observable<Household> {
    return this.http.put<Household>('/api/households', household, {responseType: 'json'}).pipe(
      tap((house: Household) => {
        console.log(house);
      }),
      catchError(err => {
        console.error('Failed to update household:', err);
        return throwError(() => new Error(err));
      })
    );
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}