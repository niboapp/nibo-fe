import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, PLATFORM_ID, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Highcharts from 'highcharts/highmaps';
import { StateVisit, LgaVisit } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-geo-demand',
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-canvas border border-dashed border-line rounded-xl min-h-[400px] flex flex-col items-center justify-center text-center p-6 text-ink-2 text-[13px]">
        <div #mapContainer class="w-full" [hidden]="!stateVisits.length"></div>
        <ng-container *ngIf="!stateVisits.length">
          <span class="empty-title">No location data yet</span>
          <span class="empty-hint max-w-80">Where visiting retailers are located will map here as you get activity.</span>
        </ng-container>
        <div *ngIf="stateVisits.length" class="flex gap-3 mt-4 text-[11px] items-center">
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
export class GeoDemandComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stateVisits: StateVisit[] = [];
  @Input() lgaVisits: LgaVisit[] = [];
  @Input() drilldownState: string | null = null;
  @Output() selectState = new EventEmitter<string>();
  @Output() clearState = new EventEmitter<void>();

  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLElement>;

  private topology: unknown;
  private chart?: Highcharts.Chart;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.http.get('/data/nigeria.topo.json').subscribe(topology => {
      this.topology = topology;
      this.renderChart();
    });
  }

  ngOnChanges(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.isBrowser || !this.topology || !this.mapContainer || !this.stateVisits.length) return;

    const data = this.stateVisits.map(v => ({ name: v.state, value: v.visits }));
    if (this.chart) {
      this.chart.series[0].setData(data);
      return;
    }

    this.chart = Highcharts.mapChart(this.mapContainer.nativeElement, {
      chart: { map: this.topology as Highcharts.TopoJSON, backgroundColor: 'transparent', height: 280 },
      title: { text: undefined },
      mapNavigation: { enabled: false },
      colorAxis: { min: 0, minColor: '#F9C6E8', maxColor: '#B3007A' },
      legend: { enabled: false },
      credits: { enabled: false },
      tooltip: { pointFormat: '{point.name}: <b>{point.value}</b> visits' },
      plotOptions: {
        map: {
          nullColor: '#F2F4F7',
          borderColor: '#FFFFFF',
          borderWidth: 0.5,
          states: { hover: { color: '#F606BA' } }
        }
      },
      series: [{
        type: 'map',
        name: 'Visits',
        joinBy: 'name',
        data,
        point: {
          events: {
            click: (e: Highcharts.PointClickEventObject) => {
              const name = (e.point as unknown as { name: string }).name;
              this.selectState.emit(name);
            }
          }
        }
      } as Highcharts.SeriesMapOptions]
    });
  }

  clearDrilldown(): void {
    this.clearState.emit();
  }
}
