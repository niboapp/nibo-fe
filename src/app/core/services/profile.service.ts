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

// 4-step onboarding completeness calc: Profile, Products >= 1, Retailers >= 1, Buying Options
export function orgCompleteness(
  org?: Organization | null,
  productsCount = 0,
  retailersCount = 0
): number {
  if (!org) return 0;
  const hasProfile = !!(org.name && org.store_name && org.business_address);
  const hasProducts = productsCount >= 1;
  const hasRetailers = retailersCount >= 1;
  const buying = org.buying_options;
  const hasBuyingOptions = !!(
    buying?.whatsapp_number ||
    (buying?.company_website && buying?.ecommerce_stores && buying.ecommerce_stores.length > 0) ||
    org.phone_number ||
    org.business_url
  );

  const completed = [hasProfile, hasProducts, hasRetailers, hasBuyingOptions].filter(Boolean).length;
  return Math.round((completed / 4) * 100);
}

function completenessHint(org: Organization, productsCount: number, retailersCount: number): string {
  const missing: string[] = [];
  if (!org.name || !org.store_name || !org.business_address) missing.push('business profile details');
  if (productsCount < 1) missing.push('at least 1 product');
  if (retailersCount < 1) missing.push('at least 1 retailer');
  const buying = org.buying_options;
  const hasBuying = !!(
    buying?.whatsapp_number ||
    (buying?.company_website && buying?.ecommerce_stores && buying.ecommerce_stores.length > 0) ||
    org.phone_number
  );
  if (!hasBuying) missing.push('buying options (WhatsApp / Online store)');
  if (!missing.length) return 'All onboarding requirements met! Your Where to Buy store URL is active.';
  return `Complete ${missing.join(', ')} to generate your store URL.`;
}

function toBusinessProfile(
  org: Organization,
  productsCount: number,
  retailersCount: number,
  userEmail: string
): BusinessProfile {
  const name = org.name ?? '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nibo.app';
  const completeness = orgCompleteness(org, productsCount, retailersCount);

  const username = org.username
    || (org.store_name ? org.store_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
    || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    || org._id
    || 'store';

  const hasBuyingOptions = !!(
    org.buying_options?.whatsapp_number ||
    (org.buying_options?.company_website && org.buying_options?.ecommerce_stores && org.buying_options.ecommerce_stores.length > 0) ||
    org.phone_number ||
    org.business_url
  );

  const isUnlocked = !!(org.name && org.store_name && org.business_address)
    && productsCount >= 1
    && retailersCount >= 1
    && hasBuyingOptions;

  return {
    name,
    handle: username,
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
    where2buyLink: isUnlocked ? `${origin}/where2buy/${username}` : '',
    profileUrl: `${origin}/p/${username}`,
    productCategories: org.product_categories ?? [],
    profileCompletenessPercent: completeness,
    completenessHint: completenessHint(org, productsCount, retailersCount),
    buyingOptions: org.buying_options,
  };
}
