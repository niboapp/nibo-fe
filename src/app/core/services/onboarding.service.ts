import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Organization } from '../models/auth.model';
import { BusinessOnboarding } from '../models/onboarding.model';
import { AuthService } from './auth.service';

// no backend source for these yet — static lists until a lookup endpoint exists
const INDUSTRIES = ['FMCG', 'Manufacturing', 'Food & Beverage', 'Retail', 'Agriculture', 'Other'];
const CATEGORIES = [
  'Beverages', 'Dairy', 'Juices', 'Snacks', 'Confectionery',
  'Personal Care', 'Household', 'Packaged Foods', 'Frozen', 'Other'
];

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAvailableCategories(): Observable<string[]> {
    return of(CATEGORIES);
  }

  getIndustries(): Observable<string[]> {
    return of(INDUSTRIES);
  }

  // PUT /v1/organizations/{orgId} — the org is created empty at signup,
  // so onboarding fills in the existing record. logoDataUrl is sent as-is
  // (base64 data URL) until a dedicated upload endpoint exists.
  submitBusiness(payload: BusinessOnboarding, logoDataUrl: string | null): Observable<Organization> {
    const orgId = this.authService.currentUser()?.organization?._id
      ?? this.authService.currentUser()?.organization_id;
    if (!orgId) {
      return throwError(() => new Error('No organization found for this account'));
    }

    const body = {
      name: payload.businessName,
      store_name: payload.storeName,
      business_address: payload.location,
      industry: payload.industry,
      product_categories: payload.categories,
      business_logo: logoDataUrl ?? '',
    };

    return this.http
      .put<ApiResponse<Organization>>(`${environment.apiUrl}/v1/organizations/${orgId}`, body)
      .pipe(
        map(res => {
          if (!res.success || !res.data) {
            throw new Error(res.message || 'Unable to save business');
          }
          return res.data;
        }),
        tap(org => this.authService.updateOrganization(org))
      );
  }
}
