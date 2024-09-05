import { Component, ViewChild } from '@angular/core';
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
import { ProgressChartComponent } from '../progress-chart/progress-chart.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AppMaterialModule,
    ReactiveFormsModule,
    DatePipe,
    ProgressChartComponent,
  ],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.css',
  providers: [DatePipe],
})
export class ActivityLogComponent {
  @ViewChild(ProgressChartComponent)
  progressChartComponent!: ProgressChartComponent;
  activityLogs: ActivityLog[] = [];
  userId = 31;
  activityLogForm!: FormGroup;
  difficultyLevels = Object.values(DifficultyLevel);
  imgData = '';

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
    this.activityLogForm.value.userId = 31;
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

  downloadActivityLogPdf() {
    const chartElement = document.getElementById('chart');

    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const imgWidth = 200;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'landscape',
        });

        pdf.setFontSize(18);
        pdf.text('Activity Log Chart', 11, 8);
        pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);

        let yPosition = imgHeight + 20;
        let pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setFontSize(12);
        pdf.text('List of Activities:', 11, yPosition);
        yPosition += 10;

        this.activityLogs.forEach((log, index) => {
          const logDetails = `
        Activity ${index + 1}: 
        Exercise: ${log.exerciseType}, 
        Duration: ${log.duration} mins, 
        Difficulty: ${log.difficultyLevel}, 
        Result: ${log.result}
        `;

          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.text(logDetails, 11, yPosition);
          yPosition += 30;
        });

        pdf.save('activity-log-chart.pdf');
      });
    }
  }
}
