import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateVisit, LgaVisit } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-geo-demand',
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-[1fr_220px] gap-6">
      <div class="bg-canvas border border-dashed border-line rounded-xl min-h-[260px] flex flex-col items-center justify-center text-center p-6 text-ink-2 text-[13px]">
        <p>World map visualization</p>
        <span class="text-[11px] text-ink-3 mt-2 max-w-80">
          Plug a mapping library in here (e.g. ngx-echarts or amCharts with a world GeoJSON) driven by [stateVisits] to render the choropleth.
        </span>
        <div class="flex gap-3 mt-4 text-[11px] items-center">
          <span><span class="w-2 h-2 rounded-full inline-block mr-1 bg-[#F9C6E8]"></span>Low</span>
          <span><span class="w-2 h-2 rounded-full inline-block mr-1 bg-[#F14FC0]"></span>Medium</span>
          <span><span class="w-2 h-2 rounded-full inline-block mr-1 bg-[#B3007A]"></span>High</span>
        </div>
      </div>

      <div class="max-h-[280px] overflow-y-auto border-l border-line pl-4">
        <button *ngIf="drilldownState" type="button" (click)="clearDrilldown()"
                class="bg-transparent border-0 text-brand text-xs cursor-pointer p-0 pb-2 block">
          ← Back to States
        </button>

        <div class="flex justify-between text-[13px] font-semibold text-ink-2 py-1.5 border-b border-line">
          <span>{{ drilldownState ? 'LGA' : 'States' }}</span>
          <span>Visits</span>
        </div>

        <ng-container *ngIf="!drilldownState">
          <button type="button" *ngFor="let row of stateVisits" (click)="selectState.emit(row.state)"
                  class="flex justify-between text-[13px] py-1.5 w-full bg-transparent border-0 cursor-pointer text-ink text-left hover:text-brand">
            <span>{{ row.state }}</span><span>{{ row.visits }}</span>
          </button>
          <p *ngIf="!stateVisits.length" class="empty-state !py-5">No data yet</p>
        </ng-container>

        <ng-container *ngIf="drilldownState">
          <div *ngFor="let row of lgaVisits" class="flex justify-between text-[13px] py-1.5 text-ink">
            <span>{{ row.lga }}</span><span>{{ row.visits }}</span>
          </div>
          <p *ngIf="!lgaVisits.length" class="empty-state !py-5">No LGA data yet</p>
        </ng-container>
      </div>
    </div>
  `
})
export class GeoDemandComponent {
  @Input() stateVisits: StateVisit[] = [];
  @Input() lgaVisits: LgaVisit[] = [];
  @Input() drilldownState: string | null = null;
  @Output() selectState = new EventEmitter<string>();
  @Output() clearState = new EventEmitter<void>();

  clearDrilldown(): void {
    this.clearState.emit();
  }
}
