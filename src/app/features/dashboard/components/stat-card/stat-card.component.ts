import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatMetric } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  template: `
    <div class="rounded-xl p-4 flex-1 min-w-0" [ngClass]="bgByColor[metric.colorClass]">
      <div class="flex justify-between items-center mb-5">
        <span class="text-ink-2">
          <i class="pi pi-chart-bar text-sm"></i>
        </span>
        <span class="text-xs font-semibold" [ngClass]="metric.changePercent < 0 ? 'text-danger' : 'text-success'">
          {{ metric.changePercent >= 0 ? '+' : '' }}{{ metric.changePercent }}%
        </span>
      </div>
      <div class="text-xl font-bold">{{ metric.value }}</div>
      <div class="text-xs text-ink-2 mt-0.5">{{ metric.label }}</div>
    </div>
  `
})
export class StatCardComponent {
  @Input({ required: true }) metric!: StatMetric;

  readonly bgByColor: Record<StatMetric['colorClass'], string> = {
    blue: 'bg-[#EAF1FF]',
    purple: 'bg-[#F1ECFB]',
    green: 'bg-[#EAF9EE]',
    orange: 'bg-[#FFF1E7]',
    teal: 'bg-[#E9F9F6]'
  };
}
