import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Task } from '../../shared/models/task.model';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { TaskComponent } from "../task/task.component";
import { TaskService } from '../../shared/services/task.service';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FlexLayoutModule, CustomMaterialModule, TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  providers: [CurrencyPipe]
})
export class TaskListComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  @Input() tasks : Task[] = [];
  activeTask: Task | null = null;
  debug : Boolean = false;
  user: User | null = null;

  constructor(
    private taskService: TaskService, 
    private userService: UserService,
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
  ) {}
  ngOnInit() {
    console.log('TaskListComponent init');
    
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(params => {
        const dbg = params['dbg'];
        if (dbg == 'xoxo') this.debug = true;
      })
      
    this.taskService.householdTasks.subscribe((tasks) => {
      console.log('taskService.householdTasks', tasks);
      this.tasks = tasks;
      if (tasks && tasks.length > 0 && !this.activeTask) {
        this.activeTask = tasks[0];
      }
    });
    this.userService.currentUser$
      .pipe(takeUntil(this._destroying$))
      .subscribe((user) => {
        console.log('userService.currentUser$', user);
        this.user = user;
      });
  }

  onSetActiveTask(task: Task) {
    console.log('onSetActiveTask', task);
    this.activeTask = task;
  }

  onAdd() {
    const task = new Task(this.user.name, this.user.householdid);
    console.log('onAdd task', task);
    this.taskService.addTask(task).subscribe((task) => {
      console.log('taskService.addTask', task);
      this.activeTask = task;
    });
  }

  taskUpdated(task: Task) {
    console.log('taskUpdated', task);
    this.activeTask = task;
    if (task && task.id) {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = task; // Update the task in the list
      }
    }
  }
}
