import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Organization } from '../models/auth.model';
import { Product, ProductRecord } from '../models/product.model';

export interface StorefrontData {
  organization: Organization;
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class StorefrontService {
  private http = inject(HttpClient);

  getStorefrontOrganization(username: string): Observable<Organization> {
    return this.http
      .get<ApiResponse<Organization>>(`${environment.apiUrl}/v1/organizations/storefront/${username}`)
      .pipe(
        map(res => {
          if (!res.data) {
            throw new Error(res.message || 'Storefront organization not found');
          }
          return res.data;
        })
      );
  }

  getStorefrontProducts(username: string): Observable<Product[]> {
    return this.http
      .get<ApiResponse<ProductRecord[]>>(`${environment.apiUrl}/v1/products/storefront/${username}`)
      .pipe(
        delay(300),
        map(res => (res.data ?? []).map(toProduct))
      );
  }
}

function toProduct(record: ProductRecord): Product {
  return {
    id: record._id,
    name: record.name ?? '',
    imageUrl: record.image_url ?? '',
    description: record.description ?? '',
    retailPrice: record.retail_price ?? 0,
    quantity: record.quantity ?? 0,
    batchNumber: record.batch_number ?? '',
    barcode: record.barcode,
    category: record.category,
    manufacturingDate: record.manufacturing_date,
    expiringDate: record.expiring_date,
    dateAdded: record.created_at,
  };
}
