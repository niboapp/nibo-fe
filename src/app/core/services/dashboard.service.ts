import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  StatMetric, VisitPoint, StateVisit, DemandGapRow,
  ProductPerformanceCard, TrafficSourceSlice, TrafficPerformanceRow, LgaVisit, RetailerDiscoveryRow
} from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // TODO(backend): replace each `of(...)` with a real HttpClient call.
  getStats(): Observable<StatMetric[]> { return of([]); }
  getVisitTrend(): Observable<VisitPoint[]> { return of([]); }
  getStateVisits(): Observable<StateVisit[]> { return of([]); }
  getDemandGap(): Observable<DemandGapRow[]> { return of([]); }
  getProductPerformance(): Observable<ProductPerformanceCard[]> { return of([]); }
  getTrafficSources(): Observable<TrafficSourceSlice[]> { return of([]); }
  getTrafficPerformance(): Observable<TrafficPerformanceRow[]> { return of([]); }
  getRetailerDiscovery(): Observable<RetailerDiscoveryRow[]> { return of([]); }
  getLgaVisits(state: string): Observable<LgaVisit[]> {
  // TODO(backend): GET /dashboard/states/:state/lgas
  return of([]);
  }
}