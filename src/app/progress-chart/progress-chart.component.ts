import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AppMaterialModule } from '../app-material/app-material.module';
import { ActivityLogService } from '../services/activity-log.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [AppMaterialModule, ReactiveFormsModule, BaseChartDirective, NgIf],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ProgressChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  isBrowser!: boolean;
  activityLogs: any[] = [];
  filteredActivityLogs: any[] = [];
  chartData: any[] = [];
  dateForm: FormGroup;

  userId = Number(localStorage.getItem('userId'));
  token = localStorage.getItem('token');

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [], //rezultat
        label: 'Weight Progress',
        backgroundColor: 'rgb(186, 0, 92)',
        borderColor: 'rgb(186, 0, 92)',
        pointBackgroundColor: 'rgb(186, 0, 92)',
        pointBorderColor: 'rgb(186, 0, 92)',
        fill: 'origin',
      },
    ],
    labels: [], //datumi
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public lineChartType: ChartType = 'line';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activityLogService: ActivityLogService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    this.dateForm = this.fb.group({
      startDate: [lastWeek],
      endDate: [today],
    });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      this.loadActivityLogs(); // Samo se učitava ako je u browseru
    }
  }

  loadActivityLogs(): void {
    this.activityLogService.getAllActivitiesByUserId(this.userId).subscribe({
      next: (data) => {
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

    if (this.chart) this.chart.chart?.update();
  }
}
