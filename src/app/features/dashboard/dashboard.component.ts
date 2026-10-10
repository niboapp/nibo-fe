import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';

import { PageHeaderComponent } from '../../core/layout/page-header/page-header.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { VisitsChartComponent } from './components/visits-chart/visits-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { GeoDemandComponent } from './components/geo-demand/geo-demand.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { orgCompleteness } from '../../core/services/profile.service';
import {
  StatMetric, VisitPoint, StateVisit, DemandGapRow,
  ProductPerformanceCard, TrafficSourceSlice, TrafficPerformanceRow, LgaVisit, RetailerDiscoveryRow
} from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, FormsModule, RouterLink,
    SelectModule, ButtonModule, TableModule, ProgressBarModule,
    PageHeaderComponent, StatCardComponent, VisitsChartComponent, DonutChartComponent, GeoDemandComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: StatMetric[] = [];
  visitTrend: VisitPoint[] = [];
  stateVisits: StateVisit[] = [];
  demandGap: DemandGapRow[] = [];
  productPerformance: ProductPerformanceCard[] = [];
  trafficSources: TrafficSourceSlice[] = [];
  trafficPerformance: TrafficPerformanceRow[] = [];
  retailerDiscovery: RetailerDiscoveryRow[] = [];
  lgaVisits: LgaVisit[] = [];
  drilldownState: string | null = null;
  showClicks = true;
  granularity = 'Daily';

  readonly granularityOptions = ['Daily', 'Weekly', 'Monthly'];

  dateRange = 'Last 30 days';
  stateFilter = 'All States';
  lgaFilter = 'LGA';

  readonly dateRangeOptions = ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 60 days', 'Last 90 days'];
  readonly stateOptions = ['All States'];
  readonly lgaOptions = ['LGA'];

  profileCompleteness = 100;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileCompleteness = orgCompleteness(this.authService.currentUser()?.organization);

    forkJoin({
      stats: this.dashboardService.getStats(),
      visitTrend: this.dashboardService.getVisitTrend(),
      stateVisits: this.dashboardService.getStateVisits(),
      demandGap: this.dashboardService.getDemandGap(),
      productPerformance: this.dashboardService.getProductPerformance(),
      trafficSources: this.dashboardService.getTrafficSources(),
      trafficPerformance: this.dashboardService.getTrafficPerformance(),
      retailerDiscovery: this.dashboardService.getRetailerDiscovery(),
    }).subscribe(result => {
      this.stats = result.stats;
      this.visitTrend = result.visitTrend;
      this.stateVisits = result.stateVisits;
      this.demandGap = result.demandGap;
      this.productPerformance = result.productPerformance;
      this.trafficSources = result.trafficSources;
      this.trafficPerformance = result.trafficPerformance;
      this.retailerDiscovery = result.retailerDiscovery;
    });
  }

  onSelectState(state: string): void {
    this.drilldownState = state;
    this.dashboardService.getLgaVisits(state).subscribe(data => (this.lgaVisits = data));
  }

  onClearDrilldown(): void {
    this.drilldownState = null;
    this.lgaVisits = [];
  }

  exportData(): void {
    // TODO(backend): trigger export endpoint / CSV generation
  }
}
