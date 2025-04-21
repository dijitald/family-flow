import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DayOfWeek, Task } from '../../shared/models/task.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Frequency } from '../../shared/models/task.model';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { TaskService } from '../../shared/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  imports: [CommonModule, CustomMaterialModule, ReactiveFormsModule, FlexLayoutModule]
})
export class TaskComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Output() updated = new EventEmitter<Task>();
  taskForm: FormGroup;
  frequencies = Object.values(Frequency);
  days: { label: string; value: number }[] = [];
  originalDays: number;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('init task', this.task);
    this.days = Object.keys(DayOfWeek)
      .filter(key => isNaN(Number(key))) // Filter out numeric keys
      .map(key => ({
        label: key, // Enum key as the label
        value: DayOfWeek[key as keyof typeof DayOfWeek] // Enum value
      }));
    this.initForms();
  }

  initForms() {
    this.taskForm = this.fb.group({
      name: [this.task.name, [Validators.required]],
      description: [this.task.description, [Validators.required]],
      rewardAmount: [this.task.rewardAmount, [Validators.required]],
      frequency: [this.task.frequency, [Validators.required]],
      interval: [this.task.interval, [Validators.required]],
      nextDueDate: [this.task.nextDueDate],
      Monday: [this.task.dayOfWeek & DayOfWeek.Monday ? true : false],
      Tuesday: [this.task.dayOfWeek & DayOfWeek.Tuesday ? true : false],
      Wednesday: [this.task.dayOfWeek & DayOfWeek.Wednesday ? true : false],
      Thursday: [this.task.dayOfWeek & DayOfWeek.Thursday ? true : false],
      Friday: [this.task.dayOfWeek & DayOfWeek.Friday ? true : false],
      Saturday: [this.task.dayOfWeek & DayOfWeek.Saturday ? true : false],
      Sunday: [this.task.dayOfWeek & DayOfWeek.Sunday ? true : false]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      this.originalDays = this.task.dayOfWeek;
      if (!changes['task'].firstChange) {
        console.log('Task input changed:', changes['task'].currentValue);
        this.updateForm(changes['task'].currentValue);
      }
    }
  }
  updateForm(task: Task) {
    this.taskForm.patchValue({
      name: task.name,
      description: task.description,
      rewardAmount: task.rewardAmount,
      frequency: task.frequency,
      interval: task.interval,
      newDueDate: task.nextDueDate,
      Monday: task.dayOfWeek & DayOfWeek.Monday ? true : false,
      Tuesday: task.dayOfWeek & DayOfWeek.Tuesday ? true : false,
      Wednesday: task.dayOfWeek & DayOfWeek.Wednesday ? true : false,
      Thursday: task.dayOfWeek & DayOfWeek.Thursday ? true : false,
      Friday: task.dayOfWeek & DayOfWeek.Friday ? true : false,
      Saturday: task.dayOfWeek & DayOfWeek.Saturday ? true : false,
      Sunday: task.dayOfWeek & DayOfWeek.Sunday ? true : false
    });
  }
  isPreselected(mask: number): boolean {
    return (this.task.dayOfWeek & mask) !== 0;
  }

  onDayChange(day: number, event: any) {
    if (event.checked) {
      this.task.dayOfWeek = this.task.dayOfWeek | day;
    } else {
      this.task.dayOfWeek = this.task.dayOfWeek & ~day;
    }    
    console.log('Day changed:', day, event.checked, this.task.dayOfWeek);
  }

  onSave() {
    if (this.taskForm.valid) {
      const updatedTask: Task = {
        ...this.task, // Keep existing task properties
        name: this.taskForm.get('name')?.value, 
        description: this.taskForm.get('description')?.value, 
        rewardAmount: this.taskForm.get('rewardAmount')?.value, 
        frequency: this.taskForm.get('frequency')?.value, 
        interval: this.taskForm.get('interval')?.value, 
        nextDueDate: this.taskForm.get('nextDueDate')?.value, 
        dayOfWeek: this.calculateDayOfWeek(), 
      };
      if (updatedTask.id === -1) {
        this.taskService.addTask(updatedTask).subscribe((task) => {
          this.updated.emit(task);
          console.log('Task added', task);
        });
      } else {
        this.taskService.updateTask(updatedTask).subscribe((task) => {
          this.updated.emit(task);
          console.log('Task updated', task);
        });
      }
      this.taskForm.reset();
      this.taskForm.get('name').setErrors(null); // Clear any errors
      this.taskForm.get('description').setErrors(null); // Clear any errors
      this.taskForm.get('rewardAmount').setErrors(null); // Clear any errors
      this.taskForm.get('frequency').setErrors(null); // Clear any errors
      this.taskForm.get('interval').setErrors(null); // Clear any errors      
      this.taskForm.get('nextDueDate').setErrors(null); // Clear any errors
    }
  }

  private calculateDayOfWeek(): number {
    let dayOfWeek = 0;

    if (this.taskForm.get('Monday')?.value) {
      dayOfWeek |= DayOfWeek.Monday;
    }
    if (this.taskForm.get('Tuesday')?.value) {
      dayOfWeek |= DayOfWeek.Tuesday;
    }
    if (this.taskForm.get('Wednesday')?.value) {
      dayOfWeek |= DayOfWeek.Wednesday;
    }
    if (this.taskForm.get('Thursday')?.value) {
      dayOfWeek |= DayOfWeek.Thursday;
    }
    if (this.taskForm.get('Friday')?.value) {
      dayOfWeek |= DayOfWeek.Friday;
    }
    if (this.taskForm.get('Saturday')?.value) {
      dayOfWeek |= DayOfWeek.Saturday;
    }
    if (this.taskForm.get('Sunday')?.value) {
      dayOfWeek |= DayOfWeek.Sunday;
    }

    return dayOfWeek;
  }

  onCancel() {
    this.task.dayOfWeek = this.originalDays; // Reset the task's dayOfWeek to the original value
    this.updateForm(this.task); // Reset the form to the original task values
    this.taskForm.get('nextDueDate')?.setValue(null);
    this.taskForm.markAsPristine(); // Mark the form as pristine
  }
  onDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirm Deletion', message: 'Are you sure you want to delete this task? If you recreate this task, history will be lost.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');
        this.taskService.deleteTask(this.task).subscribe(() => {
          this.updated.emit(null);
          console.log('Task deleted');
        });
      } else {
        console.log('User canceled deletion');
      }
    });
  }
}

