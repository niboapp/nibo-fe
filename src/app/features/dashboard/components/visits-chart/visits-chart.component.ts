import { Component, Input, OnChanges, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { VisitPoint } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-visits-chart',
  imports: [CommonModule, ChartModule],
  template: `
    <div *ngIf="data.length && isBrowser; else emptyTpl" class="h-[220px]">
      <p-chart type="line" [data]="chartData" [options]="chartOptions" />
    </div>
    <ng-template #emptyTpl><p class="empty-state">No visit data yet</p></ng-template>
  `
})
export class VisitsChartComponent implements OnChanges {
  @Input() data: VisitPoint[] = [];

  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  chartData: unknown;
  chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, boxWidth: 8 }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#ECEEF1' } }
    }
  };

  ngOnChanges(): void {
    if (!this.data.length) return;
    this.chartData = {
      labels: this.data.map(d => d.date),
      datasets: [
        {
          label: 'Searches',
          data: this.data.map(d => d.searches),
          borderColor: '#F606BA',
          backgroundColor: '#F606BA',
          tension: 0.3
        },
        {
          label: 'Retailer Clicks',
          data: this.data.map(d => d.retailerClicks),
          borderColor: '#F79009',
          backgroundColor: '#F79009',
          borderDash: [4, 4],
          tension: 0.3
        }
      ]
    };
  }
}
