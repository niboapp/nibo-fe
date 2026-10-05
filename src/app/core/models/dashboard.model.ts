export interface StatMetric {
  key: string;
  label: string;
  value: string;
  changePercent: number;
  colorClass: 'blue' | 'purple' | 'green' | 'orange' | 'teal';
}

export interface VisitPoint {
  date: string;
  searches: number;
  retailerClicks: number;
}

export interface StateVisit {
  state: string;
  visits: number;
}

export interface DemandGapRow {
  state: string;
  visits: number;
  retailers: number;
  demandPerRetailer: number;
}

export interface ProductPerformanceCard {
  id: string;
  name: string;
  totalVisits: number;
  coveragePercent: number;
  growthPercent: number;
  productViews: number;
}

export interface TrafficSourceSlice {
  label: string;
  percent: number;
  color: string;
}

export interface LgaVisit {
  lga: string;
  visits: number;
}

export interface TrafficPerformanceRow {
  source: string;
  searches: number;
  clicks: number;
  clickRate: number;
}

export interface RetailerDiscoveryRow {
  retailer: string;
  location: string;
  clicks: number;
  shareOfDemandPercent: number;
}