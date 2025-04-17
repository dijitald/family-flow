import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Frequency } from '../../shared/models/task.model';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { TaskService } from '../../shared/services/task.service';
import { interval } from 'rxjs';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('init task', this.task);
    this.initForms();
  }
  initForms() {
    this.taskForm = this.fb.group({
      name: [this.task.name, [Validators.required]],
      description: [this.task.description, [Validators.required]],
      rewardAmount: [this.task.rewardAmount, [Validators.required]],
      frequency: [this.task.frequency, [Validators.required]],
      interval: [this.task.interval, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && !changes['task'].firstChange) {
      console.log('Task input changed:', changes['task'].currentValue);
      this.updateForm(changes['task'].currentValue);
    }
  }
  updateForm(task: Task) {
    this.taskForm.patchValue({
      name: task.name,
      description: task.description,
      rewardAmount: task.rewardAmount,
      frequency: task.frequency,
      interval: task.interval,
    });
    // this.taskForm.markAsPristine(); // Reset form state to pristine
  }

  onSave() {
    if (this.taskForm.valid) {
      const updatedTask = {
        ...this.task,
        ...this.taskForm.value
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
    }
  }
  onCancel() {
    this.updateForm(this.task); // Reset the form to the original task values
  }
  onDelete() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this task? If you recreate this task, history will be lost.' }
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

