import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppMaterialModule } from '../app-material/app-material.module';
import { ActivityLog } from '../models/ActivityLog';
import { ActivityLogService } from '../services/activity-log.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [NgxChartsModule, AppMaterialModule, ReactiveFormsModule],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.css',
})
export class ProgressChartComponent implements OnInit {
  activityLogs: any[] = [];
  filteredActivityLogs: any[] = [];
  chartData: any[] = [];
  dateForm: FormGroup;

  view: [number, number] = [700, 400]; // Veličina grafikona
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Result';
  colorScheme = 'fire';

  constructor(
    private activityLogService: ActivityLogService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.dateForm = this.fb.group({
      startDate: [new Date()],
      endDate: [new Date()],
    });
  }

  ngOnInit(): void {
    this.loadActivityLogs();
  }

  loadActivityLogs(): void {
    this.activityLogService.getAllActivitiesByUserId(31).subscribe({
      next: (data) => {
        console.log(
          '🚀 ~ ProgressChartComponent ~ this.activityLogService.getAllActivitiesByUserId ~ data:',
          data
        );
        this.activityLogs = data;
        this.filterLogs();
      },
      error: (err) => {
        console.error('Failed to load activity logs', err);
      },
    });
  }

  filterLogs(): void {
    const { startDate, endDate } = this.dateForm.value;

    this.filteredActivityLogs = this.activityLogs.filter((log) => {
      const logDate = new Date(log.createdAt);
      return logDate >= startDate && logDate <= endDate;
    });
    console.log(
      '🚀 ~ ProgressChartComponent ~ this.filteredActivityLogs=this.activityLogs.filter ~ filteredActivityLogs:',
      this.filteredActivityLogs
    );

    this.chartData = this.filteredActivityLogs.map((log) => ({
      name: this.datePipe.transform(log.createdAt, 'shortDate') || '',
      value: log.result,
    }));
    console.log(
      '🚀 ~ ProgressChartComponent ~ this.chartData=this.filteredActivityLogs.map ~  this.chartData:',
      this.chartData
    );
  }
}
