import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Retailer, RetailerRecord, RetailerStats, RetailersPage } from '../models/retailer.model';
import { RetailerChainResult } from '../models/retailer-chain-result.model';

@Injectable({ providedIn: 'root' })
export class RetailersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/retailers`;

  // GET /v1/retailers — filter keys must match the backend model's json attrs
  getRetailers(filter: Record<string, string | number> = {}): Observable<RetailersPage> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      params = params.set(key, String(value));
    });

    return this.http
      .get<ApiResponse<RetailerRecord[]>>(this.baseUrl, { params })
      .pipe(
        // minimum 300ms so the table skeleton is always visible even on fast responses
        delay(300),
        map(res => {
          const pager = (res.metadata ?? {}) as { total?: number; limit?: number; skip?: number };
          return {
            items: (res.data ?? []).map(toRetailer),
            total: pager.total ?? 0,
            limit: pager.limit ?? 0,
            skip: pager.skip ?? 0,
          };
        })
      );
  }

  // POST /v1/retailers — the endpoint accepts an array for bulk adds/imports
  saveRetailers(rows: { name: string; location: string; phoneNumber: string }[]): Observable<Retailer[]> {
    const records = rows.map(row => ({
      name: row.name,
      address: row.location,
      phone_number: row.phoneNumber,
    }));
    return this.http
      .post<ApiResponse<RetailerRecord[]>>(this.baseUrl, records)
      .pipe(map(res => (res.data ?? []).map(toRetailer)));
  }

  // GET /v1/retailers/stats — total/active/inactive counts
  getRetailerStats(): Observable<RetailerStats> {
    return this.http
      .get<ApiResponse<RetailerStats>>(`${this.baseUrl}/stats`)
      .pipe(map(res => res.data ?? { total: 0, active: 0, inactive: 0 }));
  }

  getRetailer(id: string): Observable<Retailer> {
    return this.http
      .get<ApiResponse<RetailerRecord>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => toRetailer(res.data ?? {} as RetailerRecord)));
  }

  updateRetailer(id: string, changes: Partial<Retailer>): Observable<Retailer> {
    return this.http
      .put<ApiResponse<RetailerRecord>>(`${this.baseUrl}/${id}`, toRecord(changes))
      .pipe(map(res => toRetailer(res.data ?? {} as RetailerRecord)));
  }

  // PATCH /v1/retailers/{id}/status — status is 'ACTIVE' or 'DEACTIVATED'
  updateRetailerStatus(id: string, status: 'ACTIVE' | 'DEACTIVATED'): Observable<Retailer> {
    return this.http
      .patch<ApiResponse<RetailerRecord>>(`${this.baseUrl}/${id}/status`, { status })
      .pipe(map(res => toRetailer(res.data ?? {} as RetailerRecord)));
  }

  deleteRetailer(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  // TODO(backend): no retailer-chain discovery endpoint exists yet
  searchRetailerChains(term: string, state: string): Observable<RetailerChainResult[]> {
    return of([]);
  }
}

// backend document → frontend view model
function toRetailer(record: RetailerRecord): Retailer {
  return {
    id: record._id,
    name: record.name ?? '',
    location: record.address ?? '',
    phoneNumber: record.phone_number ?? '',
    status: record.status ?? 'ACTIVE',
  };
}

// frontend view model → backend payload (json attrs)
function toRecord(retailer: Partial<Retailer>): Partial<RetailerRecord> {
  return {
    name: retailer.name,
    address: retailer.location,
    phone_number: retailer.phoneNumber,
  };
}
