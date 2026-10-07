import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductPerformanceCard } from '../models/dashboard.model';

// TODO(backend): replace with data from the products endpoint
const MOCK_PRODUCTS: Product[] = [
  { id: '0001', name: 'Premium Lager 60cl', imageUrl: 'images/placeholder.png', description: 'Premium Lager Beer, crisp and refreshing with a smooth finish', retailPrice: 4000, quantity: 230, batchNumber: 'GHHHSY67277', category: 'Beverages', dateAdded: '2025-01-12' },
  { id: '0002', name: 'Stout 33cl', imageUrl: 'images/placeholder.png', description: 'Rich dark stout with roasted malt flavour', retailPrice: 4000, quantity: 230, batchNumber: 'GHHHSY67277', category: 'Beverages', dateAdded: '2025-01-12' },
  { id: '0003', name: 'Energy Drink 25cl', imageUrl: 'images/placeholder.png', description: 'High-energy caffeinated drink for active days', retailPrice: 4000, quantity: 230, batchNumber: 'GHHHSY67277', category: 'Beverages', dateAdded: '2025-01-13' },
  { id: '0004', name: 'Water 75cl', imageUrl: 'images/placeholder.png', description: 'Pure spring water, bottled at source', retailPrice: 4000, quantity: 230, batchNumber: 'GHHHSY67277', category: 'Beverages', dateAdded: '2025-01-14' },
  { id: '0005', name: 'Defiy Vanilla Chocolate 50cl', imageUrl: 'images/placeholder.png', description: 'Creamy vanilla chocolate drink, chilled serve', retailPrice: 4000, quantity: 230, batchNumber: 'GHHHSY67277', category: 'Dairy', dateAdded: '2025-01-15' },
  { id: '0006', name: 'Malt Drink 33cl', imageUrl: 'images/placeholder.png', description: 'Non-alcoholic malt beverage, rich and smooth', retailPrice: 3500, quantity: 180, batchNumber: 'GHHHSY67278', category: 'Beverages', dateAdded: '2025-01-15' },
  { id: '0007', name: 'Orange Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Freshly squeezed orange juice, no added sugar', retailPrice: 2500, quantity: 120, batchNumber: 'GHHHSY67279', category: 'Juices', dateAdded: '2025-01-16' },
  { id: '0008', name: 'Cola 50cl', imageUrl: 'images/placeholder.png', description: 'Classic cola soft drink', retailPrice: 1800, quantity: 400, batchNumber: 'GHHHSY67280', category: 'Beverages', dateAdded: '2025-01-16' },
  { id: '0009', name: 'Lemonade 40cl', imageUrl: 'images/placeholder.png', description: 'Sparkling lemonade with real lemon extract', retailPrice: 2000, quantity: 150, batchNumber: 'GHHHSY67281', category: 'Beverages', dateAdded: '2025-01-17' },
  { id: '0010', name: 'Iced Tea 50cl', imageUrl: 'images/placeholder.png', description: 'Peach-flavoured iced tea', retailPrice: 2200, quantity: 95, batchNumber: 'GHHHSY67282', category: 'Beverages', dateAdded: '2025-01-17' },
  { id: '0011', name: 'Ginger Ale 33cl', imageUrl: 'images/placeholder.png', description: 'Crisp ginger ale with a spicy kick', retailPrice: 1900, quantity: 210, batchNumber: 'GHHHSY67283', category: 'Beverages', dateAdded: '2025-01-18' },
  { id: '0012', name: 'Tonic Water 50cl', imageUrl: 'images/placeholder.png', description: 'Premium tonic water with quinine', retailPrice: 2300, quantity: 88, batchNumber: 'GHHHSY67284', category: 'Beverages', dateAdded: '2025-01-18' },
  { id: '0013', name: 'Apple Juice 50cl', imageUrl: 'images/placeholder.png', description: '100% pressed apple juice', retailPrice: 2500, quantity: 130, batchNumber: 'GHHHSY67285', category: 'Juices', dateAdded: '2025-01-19' },
  { id: '0014', name: 'Pineapple Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Tropical pineapple juice, naturally sweet', retailPrice: 2500, quantity: 140, batchNumber: 'GHHHSY67286', category: 'Juices', dateAdded: '2025-01-19' },
  { id: '0015', name: 'Coconut Water 50cl', imageUrl: 'images/placeholder.png', description: 'Natural coconut water, hydrating and fresh', retailPrice: 2800, quantity: 75, batchNumber: 'GHHHSY67287', category: 'Beverages', dateAdded: '2025-01-20' },
  { id: '0016', name: 'Sparkling Water 75cl', imageUrl: 'images/placeholder.png', description: 'Lightly carbonated spring water', retailPrice: 1500, quantity: 320, batchNumber: 'GHHHSY67288', category: 'Beverages', dateAdded: '2025-01-20' },
  { id: '0017', name: 'Black Currant Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Black currant juice blend', retailPrice: 2600, quantity: 110, batchNumber: 'GHHHSY67289', category: 'Juices', dateAdded: '2025-01-21' },
  { id: '0018', name: 'Mango Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Thick mango nectar from ripe fruit', retailPrice: 2500, quantity: 160, batchNumber: 'GHHHSY67290', category: 'Juices', dateAdded: '2025-01-21' },
  { id: '0019', name: 'Bitter Lemon 50cl', imageUrl: 'images/placeholder.png', description: 'Sharp bitter lemon soft drink', retailPrice: 2100, quantity: 90, batchNumber: 'GHHHSY67291', category: 'Beverages', dateAdded: '2025-01-22' },
  { id: '0020', name: 'Cranberry Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Tart cranberry juice blend', retailPrice: 2700, quantity: 65, batchNumber: 'GHHHSY67292', category: 'Juices', dateAdded: '2025-01-22' },
  { id: '0021', name: 'Grape Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Red grape juice, no preservatives', retailPrice: 2500, quantity: 105, batchNumber: 'GHHHSY67293', category: 'Juices', dateAdded: '2025-01-23' },
  { id: '0022', name: 'Peach Nectar 50cl', imageUrl: 'images/placeholder.png', description: 'Smooth peach nectar drink', retailPrice: 2400, quantity: 125, batchNumber: 'GHHHSY67294', category: 'Juices', dateAdded: '2025-01-23' },
  { id: '0023', name: 'Guava Juice 50cl', imageUrl: 'images/placeholder.png', description: 'Fresh guava juice, tropical flavour', retailPrice: 2600, quantity: 85, batchNumber: 'GHHHSY67295', category: 'Juices', dateAdded: '2025-01-24' },
  { id: '0024', name: 'Yogurt Drink 40cl', imageUrl: 'images/placeholder.png', description: 'Strawberry probiotic yogurt drink', retailPrice: 3000, quantity: 70, batchNumber: 'GHHHSY67296', category: 'Dairy', dateAdded: '2025-01-24' },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // TODO(backend): swap each of these for real HTTP calls
  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }

  getProduct(id: string): Observable<Product> {
    const product = MOCK_PRODUCTS.find(p => p.id === id)
      ?? { id, name: '', imageUrl: '', description: '', retailPrice: 0, quantity: 1, batchNumber: '' };
    return of({ ...product });
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
