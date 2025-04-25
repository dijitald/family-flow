import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { ActivityService } from '../../shared/services/activity.service';
import { Activity, ActivityType } from '../../shared/models/activity.model';
import { UserService } from '../../shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Task } from '../../shared/models/task.model';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-activity',
  imports: [CommonModule, CustomMaterialModule, ReactiveFormsModule, FlexLayoutModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent implements OnInit, OnChanges {
  private readonly _destroying$ = new Subject<void>();
  @Input() task: Task | null = null;
  activityForm: FormGroup;
  user: User | null = null;
  selectedTabIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}
  
  ngOnInit() {
    this.userService.currentUser$
      .pipe(takeUntil(this._destroying$))
      .subscribe((newuser) => {
        console.log('userService.currentUser$', newuser);
        if (newuser && newuser.id) {
          this.user = newuser;
        }
      });

    this.activityForm = this.fb.group({
      date: [new Date(), Validators.required],
      type: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      tags: ['']
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      console.log('task input changed:', changes['task'].currentValue);
      this.updateForm(changes['task'].currentValue);
    }
  }
  updateForm(task: Task) {
    this.activityForm.patchValue({
      description: task.name,
      amount: task.rewardAmount,
      type: ActivityType.Credit
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      console.log(this.activityForm.value);
      const newActivity = new Activity(
        this.user.householdid,
        this.activityForm.value.date,
        this.user.name,
        this.user.id, 
        this.activityForm.value.amount,
        this.activityForm.value.type,
        this.activityForm.value.description,
        this.activityForm.value.tags
      );
      console.log('new activity:', newActivity);
      this.activityService.create_activity(newActivity).subscribe({
        next: (act) => {
          console.log('activity added [%s : %s]', act.id, act.date);
          this.activityForm.reset();
          //newHouseholdName.setErrors(null);
        },
        error: (error) => {
          console.error('Failed to create activity:', error);
        }
      });
    }
  }
}
