import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Organization } from '../models/auth.model';
import { BusinessProfile } from '../models/profile.model';
import { AuthService } from './auth.service';
import { ProductsService } from './products.service';
import { RetailersService } from './retailers.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private productsService = inject(ProductsService);
  private retailersService = inject(RetailersService);

  // org profile + product/retailer totals pulled from the list pagers
  getProfile(): Observable<BusinessProfile> {
    const orgId = this.orgId();
    if (!orgId) {
      return throwError(() => new Error('No organization found for this account'));
    }

    return forkJoin({
      org: this.getOrganization(orgId),
      productsCount: this.productsService.getProducts({ limit: 1 }).pipe(map(p => p.total)),
      retailersCount: this.retailersService.getRetailers({ limit: 1 }).pipe(map(p => p.total)),
    }).pipe(
      tap(({ org }) => this.authService.updateOrganization(org)),
      map(({ org, productsCount, retailersCount }) =>
        toBusinessProfile(org, productsCount, retailersCount, this.authService.currentUser()?.email ?? '')
      )
    );
  }

  updateProfile(profile: BusinessProfile): Observable<BusinessProfile> {
    const orgId = this.orgId();
    if (!orgId) {
      return throwError(() => new Error('No organization found for this account'));
    }

    const body = {
      business_address: profile.location,
      industry: profile.industry,
      email: profile.email,
      phone_number: profile.phone,
      founded: profile.founded,
      business_url: profile.where2buyLink,
      product_categories: profile.productCategories,
    };

    return this.http
      .put<ApiResponse<Organization>>(`${environment.apiUrl}/v1/organizations/${orgId}`, body)
      .pipe(
        map(res => {
          if (!res.success || !res.data) {
            throw new Error(res.message || 'Unable to update profile');
          }
          return res.data;
        }),
        tap(org => this.authService.updateOrganization(org)),
        map(org => toBusinessProfile(org, profile.productsCount, profile.retailersCount, this.authService.currentUser()?.email ?? ''))
      );
  }

  private getOrganization(orgId: string): Observable<Organization> {
    return this.http
      .get<ApiResponse<Organization>>(`${environment.apiUrl}/v1/organizations/${orgId}`)
      .pipe(map(res => res.data ?? { _id: orgId }));
  }

  private orgId(): string | undefined {
    const user = this.authService.currentUser();
    return user?.organization?._id ?? user?.organization_id;
  }
}

// shared completeness calc — same fields the dashboard card checks
export function orgCompleteness(org?: Organization | null): number {
  if (!org) return 0;
  const filled = [
    org.name,
    org.store_name,
    org.business_address,
    org.industry,
    org.business_logo,
    org.product_categories?.length ? 'yes' : '',
  ].filter(Boolean).length;
  return Math.round((filled / 6) * 100);
}

function completenessHint(org: Organization): string {
  const missing: string[] = [];
  if (!org.name) missing.push('a business name');
  if (!org.store_name) missing.push('a store name');
  if (!org.business_address) missing.push('a location');
  if (!org.industry) missing.push('an industry');
  if (!org.business_logo) missing.push('a logo');
  if (!org.product_categories?.length) missing.push('product categories');
  if (!missing.length) return '';
  return `Add ${missing.join(', ')} to complete your profile.`;
}

function toBusinessProfile(
  org: Organization,
  productsCount: number,
  retailersCount: number,
  userEmail: string
): BusinessProfile {
  const name = org.name ?? '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const completeness = orgCompleteness(org);

  return {
    name,
    handle: org.username || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'business',
    avatarInitials: name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?',
    productsCount,
    retailersCount,
    visits: 0,
    growthPercent: 0,
    location: org.business_address ?? '',
    industry: org.industry ?? '',
    email: org.email ?? userEmail,
    phone: org.phone_number ?? '',
    founded: org.founded ?? (org.created_at ? String(new Date(org.created_at).getFullYear()) : ''),
    where2buyLink: org.business_url || `${origin}/where2buy/${org._id}`,
    profileUrl: org.profile_url || `${origin}/p/${org.username || org._id}`,
    productCategories: org.product_categories ?? [],
    profileCompletenessPercent: completeness,
    completenessHint: completenessHint(org),
  };
}
