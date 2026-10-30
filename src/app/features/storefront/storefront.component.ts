import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { StorefrontService } from '../../core/services/storefront.service';
import { Organization } from '../../core/models/auth.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SkeletonModule],
  templateUrl: './storefront.component.html',
  styleUrls: ['./storefront.component.css'],
})
export class StorefrontComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private storefrontService = inject(StorefrontService);

  // Signals
  username = signal<string>('');
  isLoadingOrg = signal<boolean>(true);
  isLoadingProducts = signal<boolean>(true);
  orgError = signal<string | null>(null);

  organization = signal<Organization | null>(null);
  allProducts = signal<Product[]>([]);

  // Filtering & Sorting
  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');
  selectedSort = signal<string>('highest_rated');
  inStockOnly = signal<boolean>(false);
  nafdacOnly = signal<boolean>(false);

  // Distinct categories computed from loaded products
  categories = computed<string[]>(() => {
    const set = new Set<string>();
    for (const p of this.allProducts()) {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    }
    return ['All', ...Array.from(set)];
  });

  // Filtered & Sorted products
  filteredProducts = computed<Product[]>(() => {
    let list = [...this.allProducts()];

    // 1. Category Filter
    const cat = this.selectedCategory();
    if (cat && cat !== 'All') {
      list = list.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase());
    }

    // 2. Search Query
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.batchNumber && p.batchNumber.toLowerCase().includes(query)) ||
          (p.barcode && p.barcode.toLowerCase().includes(query))
      );
    }

    // 3. Stock filter
    if (this.inStockOnly()) {
      list = list.filter(p => (p.quantity ?? 0) > 0);
    }

    // 4. Sort
    switch (this.selectedSort()) {
      case 'price_low':
        list.sort((a, b) => a.retailPrice - b.retailPrice);
        break;
      case 'price_high':
        list.sort((a, b) => b.retailPrice - a.retailPrice);
        break;
      case 'newest':
        list.sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''));
        break;
      case 'highest_rated':
      default:
        // Natural default sort
        break;
    }

    return list;
  });

  ngOnInit(): void {
    const rawUsername = this.route.snapshot.paramMap.get('username') || '';
    this.username.set(rawUsername);

    if (rawUsername) {
      this.loadStorefront(rawUsername);
    } else {
      this.isLoadingOrg.set(false);
      this.isLoadingProducts.set(false);
      this.orgError.set('No store username provided');
    }
  }

  loadStorefront(username: string): void {
    this.isLoadingOrg.set(true);
    this.isLoadingProducts.set(true);
    this.orgError.set(null);

    // 1. Load Organization
    this.storefrontService.getStorefrontOrganization(username).subscribe({
      next: org => {
        this.organization.set(org);
        this.isLoadingOrg.set(false);
      },
      error: err => {
        this.orgError.set(err.message || 'Store not found');
        this.isLoadingOrg.set(false);
      },
    });

    // 2. Load Products
    this.storefrontService.getStorefrontProducts(username).subscribe({
      next: prods => {
        this.allProducts.set(prods);
        this.isLoadingProducts.set(false);
      },
      error: () => {
        this.allProducts.set([]);
        this.isLoadingProducts.set(false);
      },
    });
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  toggleInStock(): void {
    this.inStockOnly.update(v => !v);
  }

  toggleNafdac(): void {
    this.nafdacOnly.update(v => !v);
  }

  formatPrice(val?: number): string {
    if (val == null) return '₦0';
    return '₦' + val.toLocaleString();
  }
}
