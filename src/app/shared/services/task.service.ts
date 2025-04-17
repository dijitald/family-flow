import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root'})
export class TaskService implements OnInit, OnDestroy{
    private readonly _destroying$ = new Subject<void>();
    private _householdTasks$: BehaviorSubject<Task[]> = new BehaviorSubject(undefined);

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) { }
    ngOnInit(): void {
        console.log('TaskService init');

        this.userService.currentUser$
            .pipe(takeUntil(this._destroying$))
            .subscribe((newuser) => {
                console.log('userService.currentUser$', newuser);
                if (newuser && newuser.householdid) {
                    this.getHouseholdTasks(newuser.householdid);
                }
            });
    }

    public get householdTasks(): Observable<Task[]> {
        return this._householdTasks$.asObservable();
    }

    public getHouseholdTasks(hid: string): void {
        console.log('getHouseholdTasks', hid);

        this.http.get<Task[]>(`/api/tasks/`, {headers : { 'id': hid }, responseType: 'json' })
        .subscribe({
            next: (tlist) => {
                console.log("getHouseholdTasks", tlist);
                this._householdTasks$.next(tlist);
                if (tlist) {
                }
            },
            error: err => {
                console.error('Failed to get tasks:', err);
            }
        });
    }

    public addTask(task:Task): Observable<Task> {
        return this.http.post<Task>('/api/tasks', task, {responseType: 'json'}).pipe(
            tap((t: Task) => {
                console.log("addTask", t);
                this._householdTasks$.next([t, ...this._householdTasks$.getValue()]);
            }),
            catchError(err => {
                console.error('Failed to create task:', err);
                return throwError(() => new Error(err));
            })
        );
    }
    public updateTask(task: Task): Observable<Task> {
        console.log("updateTask", task);
        return this.http.put<Task>('/api/tasks', task, {responseType: 'json'}).pipe(
            tap((t: Task) => {
                console.log("updateTask", t);
                const tasks = this._householdTasks$.getValue();
                const index = tasks.findIndex((t) => t.id === task.id);
                if (index !== -1) {
                    tasks[index] = t;
                }
                this._householdTasks$.next([...tasks]);
            }),
            catchError(err => {
                console.error('Failed to update task:', err);
                return throwError(() => new Error(err));
            })
        );
    }
    public deleteTask(task: Task): Observable<Task> {
        return this.http.delete<Task>('/api/tasks', {headers : { 'id': task.id.toString() }, responseType: 'json' }).pipe(
            tap((t: Task) => {
                console.log("deleteTask", t);
                const tasks = this._householdTasks$.getValue();
                const index = tasks.findIndex((t) => t.id === task.id);
                if (index !== -1) {
                    tasks.splice(index, 1);
                }
                this._householdTasks$.next([...tasks]);
            }),
            catchError(err => {
                console.error('Failed to delete task:', err);
                return throwError(() => new Error(err));
            })
        );
    }

    ngOnDestroy(): void {
        this._destroying$.next();
        this._destroying$.complete();
    }
}
