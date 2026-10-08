import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Product, ProductRecord, ProductsPage } from '../models/product.model';
import { ProductPerformanceCard } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/products`;

  // GET /v1/products — filter keys must match the backend model's json attrs
  getProducts(filter: Record<string, string | number> = {}): Observable<ProductsPage> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      params = params.set(key, String(value));
    });

    return this.http
      .get<ApiResponse<ProductRecord[]>>(this.baseUrl, { params })
      .pipe(
        // minimum 300ms so the table skeleton is always visible even on fast responses
        delay(300),
        map(res => {
          const pager = (res.metadata ?? {}) as { total?: number; limit?: number; skip?: number };
          return {
            items: (res.data ?? []).map(toProduct),
            total: pager.total ?? 0,
            limit: pager.limit ?? 0,
            skip: pager.skip ?? 0,
          };
        })
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<ApiResponse<ProductRecord>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => toProduct(res.data ?? {} as ProductRecord)));
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http
      .post<ApiResponse<ProductRecord>>(this.baseUrl, toRecord(product))
      .pipe(map(res => toProduct(res.data ?? {} as ProductRecord)));
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<ApiResponse<ProductRecord>>(`${this.baseUrl}/${id}`, toRecord(product))
      .pipe(map(res => toProduct(res.data ?? {} as ProductRecord)));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  // TODO(backend): no product-performance/analytics endpoint exists yet
  getProductPerformance(): Observable<ProductPerformanceCard[]> {
    return of([]);
  }
}

// backend document → frontend view model
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

// frontend view model → backend payload (json attrs)
function toRecord(product: Partial<Product>): Partial<ProductRecord> {
  return {
    name: product.name,
    description: product.description,
    image_url: product.imageUrl,
    retail_price: product.retailPrice,
    quantity: product.quantity,
    barcode: product.barcode,
    batch_number: product.batchNumber,
    category: product.category,
    manufacturing_date: product.manufacturingDate,
    expiring_date: product.expiringDate,
  };
}
