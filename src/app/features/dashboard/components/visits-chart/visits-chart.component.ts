import { Component, Input, OnChanges, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { VisitPoint } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-visits-chart',
  imports: [CommonModule, ChartModule],
  template: `
    <div *ngIf="data.length && isBrowser; else emptyTpl" class="h-[280px]">
      <p-chart type="line" [data]="chartData" [options]="chartOptions" />
    </div>
    <ng-template #emptyTpl><p class="empty-state">No visit data yet</p></ng-template>
  `
})
export class VisitsChartComponent implements OnChanges {
  @Input() data: VisitPoint[] = [];
  @Input() showClicks = true;

  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  chartData: unknown;
  chartOptions = {
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, pointStyle: 'circle' as const, boxWidth: 8, padding: 16 }
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, suggestedMax: 1000, grid: { color: '#ECEEF1', dash: [4, 4] } }
    }
  };

  ngOnChanges(): void {
    if (!this.data.length) return;
    const pointStyle = {
      pointRadius: 4,
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2
    };
    this.chartData = {
      labels: this.data.map(d => d.date),
      datasets: [
        {
          label: 'Searches',
          data: this.data.map(d => d.searches),
          borderColor: '#F606BA',
          backgroundColor: '#F606BA',
          pointBackgroundColor: '#F606BA',
          tension: 0.3,
          ...pointStyle
        },
        {
          label: 'Retailer Clicks',
          data: this.data.map(d => d.retailerClicks),
          borderColor: '#F79009',
          backgroundColor: '#F79009',
          pointBackgroundColor: '#F79009',
          borderDash: [4, 4],
          tension: 0.3,
          hidden: !this.showClicks,
          ...pointStyle
        }
      ]
    };
  }
}
