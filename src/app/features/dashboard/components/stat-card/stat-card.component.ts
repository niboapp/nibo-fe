import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatMetric } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  host: { 'class': 'flex-1 min-w-0' },
  template: `
    <div class="rounded-xl p-4 h-full" [ngClass]="bgByColor[metric.colorClass]">
      <div class="flex justify-between items-center mb-5">
        <span [ngClass]="iconColorByClass[metric.colorClass]">
          <i class="pi {{ iconByKey[metric.key] || 'pi-chart-bar' }} text-sm"></i>
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

  readonly iconColorByClass: Record<StatMetric['colorClass'], string> = {
    blue: 'text-[#3B82F6]',
    purple: 'text-[#8B5CF6]',
    green: 'text-[#12B76A]',
    orange: 'text-[#F79009]',
    teal: 'text-[#14B8A6]'
  };

  readonly iconByKey: Record<string, string> = {
    totalVisits: 'pi-search',
    productViews: 'pi-eye',
    onlineOrders: 'pi-shopping-bag',
    demandGrowth: 'pi-chart-line',
    retailerClicks: 'pi-link'
  };
}
