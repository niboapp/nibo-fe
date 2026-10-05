import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Retailer } from '../models/retailer.model';
import { RetailerChainResult } from '../models/retailer-chain-result.model';

@Injectable({ providedIn: 'root' })
export class RetailersService {
  // TODO(backend): swap this for a real HTTP call, e.g.
  // constructor(private http: HttpClient) {}
  // getRetailers(): Observable<Retailer[]> {
  //   return this.http.get<Retailer[]>(`${environment.apiUrl}/retailers`);
  // }
  getRetailers(): Observable<Retailer[]> {
    return of([]);
  }

  saveRetailers(rows: { name: string; location: string; phoneNumber: string }[]): Observable<void> {
    // TODO(backend): POST rows to the retailers endpoint
    return of(void 0);
  }

  getRetailer(id: string): Observable<Retailer> {
    // TODO(backend): GET /retailers/:id
    return of({ id, name: '', location: '', phoneNumber: '' });
  }

  updateRetailer(id: string, changes: Partial<Retailer>): Observable<void> {
    // TODO(backend): PUT /retailers/:id
    return of(void 0);
  }

  searchRetailerChains(term: string, state: string): Observable<RetailerChainResult[]> {
    // TODO(backend): GET /retailers/chains?query=term&state=state
    return of([]);
  }

  deleteRetailer(id: string): Observable<void> {
    // TODO(backend): DELETE /retailers/:id
    return of(void 0);
  }
}