import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductPerformanceCard } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // TODO(backend): swap each of these for real HTTP calls
  getProducts(): Observable<Product[]> {
    return of([]);
  }

  getProduct(id: string): Observable<Product> {
    return of({ id, name: '', imageUrl: '', description: '', retailPrice: 0, quantity: 1, batchNumber: '' });
  }

  addProduct(formData: FormData): Observable<void> {
    return of(void 0);
  }

  updateProduct(id: string, formData: FormData): Observable<void> {
    return of(void 0);
  }

  deleteProduct(id: string): Observable<void> {
    return of(void 0);
  }

  getProductPerformance(): Observable<ProductPerformanceCard[]> {
    return of([]);
  }
}