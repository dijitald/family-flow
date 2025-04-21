import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../shared/models/task.model';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';

@Component({
  selector: 'app-activity',
  imports: [CommonModule, CustomMaterialModule, ReactiveFormsModule, FlexLayoutModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent {
  @Input() task: Task;

}
