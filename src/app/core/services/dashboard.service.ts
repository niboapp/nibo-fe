import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import {
  StatMetric, VisitPoint, StateVisit, DemandGapRow,
  ProductPerformanceCard, TrafficSourceSlice, TrafficPerformanceRow, LgaVisit, RetailerDiscoveryRow
} from '../models/dashboard.model';
import { ProductsService } from './products.service';
import { NigeriaGeoService } from './nigeria-geo.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private productsService: ProductsService, private nigeriaGeo: NigeriaGeoService) {}

  // TODO(backend): replace each `of(...)` with a real HttpClient call.
  // TODO(backend): GET /dashboard/stats — the five metric definitions are the
  // contract; a real endpoint fills in value/changePercent
  getStats(): Observable<StatMetric[]> {
    return of<StatMetric[]>([
      { key: 'totalVisits', label: 'Total Visits', value: '0', changePercent: 0, colorClass: 'teal' },
      { key: 'productViews', label: 'Product Views', value: '0', changePercent: 0, colorClass: 'purple' },
      { key: 'onlineOrders', label: 'Online Orders', value: '0', changePercent: 0, colorClass: 'green' },
      { key: 'demandGrowth', label: 'Demand Growth', value: '0%', changePercent: 0, colorClass: 'orange' },
      { key: 'retailerClicks', label: 'Retailer Clicks', value: '0', changePercent: 0, colorClass: 'blue' },
    ]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/visit-trend
  getVisitTrend(): Observable<VisitPoint[]> {
    return of([]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/state-visits — state names must match the
  // Nigeria topojson's `name` properties (e.g. 'Federal Capital Territory')
  getStateVisits(): Observable<StateVisit[]> {
    return of<StateVisit[]>([
      { state: 'Lagos', visits: 2400 },
      { state: 'Rivers', visits: 1850 },
      { state: 'Oyo', visits: 1420 },
      { state: 'Kano', visits: 1100 },
      { state: 'Federal Capital Territory', visits: 980 },
      { state: 'Kaduna', visits: 760 },
      { state: 'Enugu', visits: 640 },
      { state: 'Delta', visits: 520 },
      { state: 'Anambra', visits: 430 },
      { state: 'Ogun', visits: 380 },
    ]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/demand-gap
  getDemandGap(): Observable<DemandGapRow[]> {
    return of([]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/product-performance — replace with the dashboard endpoint
  getProductPerformance(): Observable<ProductPerformanceCard[]> {
    return this.productsService.getProductPerformance();
  }

  // TODO(backend): GET /dashboard/traffic-sources
  getTrafficSources(): Observable<TrafficSourceSlice[]> {
    return of([]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/traffic-performance
  getTrafficPerformance(): Observable<TrafficPerformanceRow[]> {
    return of([]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/retailer-discovery
  getRetailerDiscovery(): Observable<RetailerDiscoveryRow[]> {
    return of([]).pipe(delay(300));
  }

  // TODO(backend): GET /dashboard/states/:state/lgas — real LGA names from
  // nigeria-states-lgas.json; visit counts are deterministic placeholders
  getLgaVisits(state: string): Observable<LgaVisit[]> {
    return this.nigeriaGeo.getLgaNames(state).pipe(
      map(names => names.map(lga => ({
        lga,
        visits: 40 + ((lga.length * 37) % 700)
      }))),
      delay(300)
    );
  }
}