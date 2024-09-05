import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AppMaterialModule } from '../app-material/app-material.module';
import { ActivityLogService } from '../services/activity-log.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [AppMaterialModule, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.css',
})
export class ProgressChartComponent implements OnInit {
  activityLogs: any[] = [];
  filteredActivityLogs: any[] = [];
  chartData: any[] = [];
  dateForm: FormGroup;
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Weight Progress',
        backgroundColor: 'rgba(63, 81, 181, 0.3)',
        borderColor: 'rgba(63, 81, 181, 1)',
        pointBackgroundColor: 'rgba(63, 81, 181, 1)',
        pointBorderColor: '#fff',
        fill: 'origin',
      },
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public lineChartType: ChartType = 'line';

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
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    this.filteredActivityLogs = this.activityLogs.filter((log) => {
      const logDate = new Date(log.createdAt).setHours(0, 0, 0);
      return logDate >= start && logDate <= end;
    });

    this.lineChartData.labels = this.filteredActivityLogs.map((log) =>
      this.datePipe.transform(log.createdAt, 'shortDate')
    );
    this.lineChartData.datasets[0].data = this.filteredActivityLogs.map(
      (log) => log.result
    );
  }
}
