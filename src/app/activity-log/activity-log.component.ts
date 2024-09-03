import { Component } from '@angular/core';
import { ActivityLog } from '../models/ActivityLog';
import { ActivityLogService } from '../services/activity-log.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DifficultyLevel } from '../models/DifficultyLevel';
@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [NgFor, NgIf, AppMaterialModule, ReactiveFormsModule, DatePipe],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.css',
})
export class ActivityLogComponent {
  activityLogs: ActivityLog[] = [];
  userId = 41;
  activityLogForm!: FormGroup;
  difficultyLevels = Object.values(DifficultyLevel);

  constructor(
    private fb: FormBuilder,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.activityLogForm = this.fb.group({
      exerciseType: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      difficultyLevel: ['', Validators.required],
      result: ['', Validators.required],
    });
    this.loadActivityLogs();
  }

  loadActivityLogs() {
    this.activityLogService.getAllActivitiesByUserId(this.userId).subscribe({
      next: (data) => {
        this.activityLogs = data;
      },
      error: (err) => {
        console.error('Failed to load activity logs', err);
      },
    });
  }

  onSubmit(): void {
    this.activityLogForm.value.userId = 41;
    if (this.activityLogForm.valid) {
      this.activityLogService
        .addActivityLog(this.activityLogForm.value)
        .subscribe(
          (response) => {
            console.log('Log saved successfully:', response);
            this.activityLogForm.reset();
            this.loadActivityLogs();
          },
          (error) => {
            console.error('Error saving log:', error);
          }
        );
    }
  }

  deleteActivityLog(id: number) {
    if (confirm('Are you sure you want to delete this activity log?')) {
      this.activityLogService.deleteActivityLog(id).subscribe(() => {
        this.loadActivityLogs();
      });
    }
  }

  downloadActivityLogPdf() {}
}
