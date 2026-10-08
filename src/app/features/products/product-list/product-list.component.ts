import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product.model';
import { ProductPerformanceCard } from '../../../core/models/dashboard.model';
import { ProductsService } from '../../../core/services/products.service';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { ProductViewModalComponent } from '../components/product-view-modal/product-view-modal.component';

type ProductTab = 'list' | 'performance';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule, FormsModule, RouterLink,
    TabsModule, TableModule, ButtonModule, IconFieldModule, InputIconModule,
    InputTextModule, MenuModule, PaginatorModule, SkeletonModule,
    PageHeaderComponent, ProductViewModalComponent
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productTotal = 0;
  loadingProducts = true;
  skeletonRows: Product[] = new Array(5).fill({} as Product);
  performanceCards: ProductPerformanceCard[] = [];

  searchTerm = '';

  productPageSize = 5;
  productFirst = 0;

  performancePageSize = 6;
  performanceFirst = 0;

  activeTab: ProductTab = 'list';

  viewingProduct: Product | null = null;
  selectedProduct: Product | null = null;

  menuItems: MenuItem[];

  constructor(
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.menuItems = [
      { label: 'View', icon: 'pi pi-eye', command: () => this.selectedProduct && this.viewProduct(this.selectedProduct) },
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.selectedProduct && this.router.navigate(['/app/products', this.selectedProduct.id, 'edit']) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.selectedProduct && this.requestDelete(this.selectedProduct.id) }
    ];
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('tab') === 'performance') {
        this.activeTab = 'performance';
      }
    });
    this.loadProducts();
    this.productsService.getProductPerformance().subscribe(data => (this.performanceCards = data));
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productsService
      .getProducts({ limit: this.productPageSize, skip: this.productFirst })
      .subscribe({
        next: (page) => {
          this.products = page.items;
          this.productTotal = page.total;
          this.loadingProducts = false;
        },
        error: (err) => {
          this.loadingProducts = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Unable to load products',
            detail: err?.error?.message || 'Something went wrong. Please try again.'
          });
        }
      });
  }

  // server-side paging returns one page at a time — search filters the loaded page
  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.batchNumber.toLowerCase().includes(term)
    );
  }

  get filteredPerformanceCards(): ProductPerformanceCard[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.performanceCards;
    return this.performanceCards.filter(c => c.name.toLowerCase().includes(term));
  }

  get pagedPerformanceCards(): ProductPerformanceCard[] {
    return this.filteredPerformanceCards.slice(this.performanceFirst, this.performanceFirst + this.performancePageSize);
  }

  onSearch(): void {
    this.productFirst = 0;
    this.performanceFirst = 0;
  }

  onProductPageChange(event: PaginatorState): void {
    this.productFirst = event.first ?? 0;
    this.loadProducts();
  }

  onPerformancePageChange(event: PaginatorState): void {
    this.performanceFirst = event.first ?? 0;
  }

  openMenu(event: Event, menu: { toggle: (e: Event) => void }, product: Product): void {
    this.selectedProduct = product;
    menu.toggle(event);
  }

  viewProduct(product: Product): void {
    this.viewingProduct = product;
  }

  requestDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.productsService.deleteProduct(id).subscribe(() => {
          // step back a page if we just deleted the last item on this page
          if (this.products.length === 1 && this.productFirst > 0) {
            this.productFirst = Math.max(0, this.productFirst - this.productPageSize);
          }
          this.loadProducts();
        });
      }
    });
  }

  truncate(text: string, max: number): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
