import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ConfirmationService, MenuItem } from 'primeng/api';
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
    InputTextModule, MenuModule, PaginatorModule,
    PageHeaderComponent, ProductViewModalComponent
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  performanceCards: ProductPerformanceCard[] = [];

  searchTerm = '';
  readonly globalFilterFields = ['name', 'description', 'batchNumber'];

  performancePageSize = 6;
  performancePage = 1;

  activeTab: ProductTab = 'list';

  viewingProduct: Product | null = null;
  selectedProduct: Product | null = null;

  menuItems: MenuItem[];

  constructor(
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.menuItems = [
      { label: 'View', icon: 'pi pi-eye', command: () => this.selectedProduct && this.viewProduct(this.selectedProduct) },
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.selectedProduct && this.router.navigate(['/app/products', this.selectedProduct.id, 'edit']) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.selectedProduct && this.requestDelete(this.selectedProduct.id) }
    ];
  }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(data => (this.products = data));
    this.productsService.getProductPerformance().subscribe(data => (this.performanceCards = data));
  }

  onSearch(table: Table): void {
    this.performancePage = 1;
    table.filterGlobal(this.searchTerm, 'contains');
  }

  get filteredPerformanceCards(): ProductPerformanceCard[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.performanceCards;
    return this.performanceCards.filter(c => c.name.toLowerCase().includes(term));
  }

  get pagedPerformanceCards(): ProductPerformanceCard[] {
    const start = (this.performancePage - 1) * this.performancePageSize;
    return this.filteredPerformanceCards.slice(start, start + this.performancePageSize);
  }

  onPerformancePageChange(event: PaginatorState): void {
    this.performancePage = (event.page ?? 0) + 1;
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
          this.products = this.products.filter(p => p.id !== id);
        });
      }
    });
  }

  truncate(text: string, max: number): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
