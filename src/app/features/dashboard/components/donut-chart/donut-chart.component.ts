import { Component, Input, OnChanges, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TrafficSourceSlice } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-donut-chart',
  imports: [CommonModule, ChartModule],
  template: `
    <div *ngIf="slices.length && isBrowser; else emptyTpl" class="flex items-center gap-6">
      <div class="w-80 h-80 shrink-0">
        <p-chart type="polarArea" [data]="chartData" [options]="chartOptions" />
      </div>
      <ul class="list-none m-0 p-0 text-[13px]">
        <li *ngFor="let s of slices" class="flex items-center gap-2 mb-2 text-ink-2">
          <span class="w-2.5 h-2.5 rounded-full inline-block" [style.background]="s.color"></span>
          {{ s.label }} — {{ s.percent }}%
        </li>
      </ul>
    </div>
    <ng-template #emptyTpl><p class="empty-state">No traffic data yet</p></ng-template>
  `
})
export class DonutChartComponent implements OnChanges {
  @Input() slices: TrafficSourceSlice[] = [];

  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  chartData: unknown;
  chartOptions = {
    maintainAspectRatio: false,
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: { legend: { display: false } }
  };

  ngOnChanges(): void {
    this.chartData = {
      labels: this.slices.map(s => s.label),
      datasets: [
        {
          data: this.slices.map(s => s.percent),
          backgroundColor: this.slices.map(s => s.color),
          borderWidth: 0
        }
      ]
    };
  }
}
