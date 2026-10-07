import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  StatMetric, VisitPoint, StateVisit, DemandGapRow,
  ProductPerformanceCard, TrafficSourceSlice, TrafficPerformanceRow, LgaVisit, RetailerDiscoveryRow
} from '../models/dashboard.model';
import { ProductsService } from './products.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private productsService: ProductsService) {}

  // TODO(backend): replace each `of(...)` with a real HttpClient call.
  getStats(): Observable<StatMetric[]> {
    return of([
      { key: 'totalVisits', label: 'Total Visits', value: '18,420', changePercent: 12.4, colorClass: 'teal' },
      { key: 'productViews', label: 'Product Views', value: '42,310', changePercent: 8.7, colorClass: 'purple' },
      { key: 'onlineOrders', label: 'Online Orders', value: '156', changePercent: 3.2, colorClass: 'green' },
      { key: 'demandGrowth', label: 'Demand Growth', value: '15.8%', changePercent: 2.1, colorClass: 'orange' },
      { key: 'retailerClicks', label: 'Retailer Clicks', value: '6,840', changePercent: 18.3, colorClass: 'blue' },
    ]);
  }
  // TODO(backend): GET /dashboard/visit-trend
  getVisitTrend(): Observable<VisitPoint[]> {
    return of([
      { date: 'Jan 4', searches: 930, retailerClicks: 150 },
      { date: 'Jan 6', searches: 680, retailerClicks: 260 },
      { date: 'Jan 8', searches: 720, retailerClicks: 120 },
      { date: 'Jan 10', searches: 640, retailerClicks: 380 },
      { date: 'Jan 12', searches: 2700, retailerClicks: 560 },
      { date: 'Jan 14', searches: 690, retailerClicks: 370 },
      { date: 'Jan 16', searches: 750, retailerClicks: 470 },
      { date: 'Jan 18', searches: 1730, retailerClicks: 330 },
      { date: 'Jan 20', searches: 1040, retailerClicks: 1330 },
      { date: 'Jan 22', searches: 670, retailerClicks: 350 },
      { date: 'Jan 24', searches: 720, retailerClicks: 460 },
      { date: 'Jan 26', searches: 550, retailerClicks: 1390 },
      { date: 'Jan 30', searches: 640, retailerClicks: 1350 },
    ]);
  }
  getStateVisits(): Observable<StateVisit[]> { return of([]); }
  // TODO(backend): GET /dashboard/demand-gap
  getDemandGap(): Observable<DemandGapRow[]> {
    return of([
      { state: 'Kaduna', visits: 720, retailers: 1, demandPerRetailer: 720 },
      { state: 'Kano', visits: 1400, retailers: 5, demandPerRetailer: 280 },
      { state: 'Edo', visits: 3200, retailers: 12, demandPerRetailer: 267 },
      { state: 'Lagos', visits: 980, retailers: 4, demandPerRetailer: 245 },
      { state: 'Rivers', visits: 650, retailers: 3, demandPerRetailer: 217 },
      { state: 'Abia', visits: 540, retailers: 2, demandPerRetailer: 270 },
    ]);
  }
  // TODO(backend): GET /dashboard/product-performance — replace with the dashboard endpoint
  getProductPerformance(): Observable<ProductPerformanceCard[]> {
    return this.productsService.getProductPerformance();
  }
  // TODO(backend): GET /dashboard/traffic-sources
  getTrafficSources(): Observable<TrafficSourceSlice[]> {
    return of([
      { label: 'Direct Search', percent: 35, color: '#F606BA' },
      { label: 'Social Media', percent: 28, color: '#8B5CF6' },
      { label: 'Influencer Campaign', percent: 18, color: '#F79009' },
      { label: 'Paid Ads', percent: 12, color: '#12B76A' },
      { label: 'Referral Links', percent: 17, color: '#3B82F6' },
    ]);
  }
  // TODO(backend): GET /dashboard/traffic-performance
  getTrafficPerformance(): Observable<TrafficPerformanceRow[]> {
    return of([
      { source: 'Direct Search', searches: 720, clicks: 1, clickRate: 720 },
      { source: 'Social Media', searches: 1400, clicks: 5, clickRate: 280 },
      { source: 'Paid Ads', searches: 3200, clicks: 12, clickRate: 267 },
      { source: 'Referral Links', searches: 980, clicks: 4, clickRate: 245 },
      { source: 'Influencer Campaigns', searches: 650, clicks: 3, clickRate: 217 },
    ]);
  }
  // TODO(backend): GET /dashboard/retailer-discovery
  getRetailerDiscovery(): Observable<RetailerDiscoveryRow[]> {
    return of([
      { retailer: 'ShopRite Lagos', location: 'Lagos', clicks: 480, shareOfDemandPercent: 15 },
      { retailer: 'SPAR Abuja', location: 'Abuja', clicks: 210, shareOfDemandPercent: 3 },
      { retailer: 'Justrite Ibadan', location: 'Oyo', clicks: 160, shareOfDemandPercent: 5 },
      { retailer: 'Market Square', location: 'Rivers', clicks: 86, shareOfDemandPercent: 7 },
      { retailer: 'Addide Supermarket', location: 'Lagos', clicks: 55, shareOfDemandPercent: 11 },
    ]);
  }
  getLgaVisits(state: string): Observable<LgaVisit[]> {
  // TODO(backend): GET /dashboard/states/:state/lgas
  return of([]);
  }
}