import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Retailer, RetailerStats } from '../../../core/models/retailer.model';
import { RetailersService } from '../../../core/services/retailers.service';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { RetailerViewModalComponent } from '../components/retailer-view-modal/retailer-view-modal.component';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-retailer-list',
  imports: [
    CommonModule, FormsModule, RouterLink,
    TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, MenuModule,
    PaginatorModule, SkeletonModule, BadgeModule,
    PageHeaderComponent, RetailerViewModalComponent
  ],
  templateUrl: './retailer-list.component.html'
})
export class RetailerListComponent implements OnInit {
  retailers: Retailer[] = [];
  retailerTotal = 0;
  loading = true;
  loadingStats = true;
  stats: RetailerStats = { total: 0, active: 0, inactive: 0 };
  searchTerm = '';
  pageSize = 10;
  first = 0;
  skeletonRows: Retailer[] = new Array(10).fill({} as Retailer);
  viewingRetailer: Retailer | null = null;
  selectedRetailer: Retailer | null = null;

  menuItems: MenuItem[];

  constructor(
    private retailersService: RetailersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.menuItems = [
      { label: 'View', icon: 'pi pi-eye', command: () => this.selectedRetailer && this.viewRetailer(this.selectedRetailer) },
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.selectedRetailer && this.router.navigate(['/app/retailers', this.selectedRetailer.id, 'edit']) },
      { label: 'Deactivate', icon: 'pi pi-power-off', command: () => this.selectedRetailer && this.toggleStatus(this.selectedRetailer) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.selectedRetailer && this.requestDelete(this.selectedRetailer.id) }
    ];
  }

  ngOnInit(): void {
    this.loadRetailers();
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats = true;
    this.retailersService.getRetailerStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loadingStats = false;
      },
      error: () => (this.loadingStats = false)
    });
  }

  loadRetailers(): void {
    this.loading = true;
    this.retailersService
      .getRetailers({ limit: this.pageSize, skip: this.first })
      .subscribe({
        next: (page) => {
          this.retailers = page.items;
          this.retailerTotal = page.total;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Unable to load retailers',
            detail: err?.error?.message || 'Something went wrong. Please try again.'
          });
        }
      });
  }

  // server-side paging returns one page at a time — search filters the loaded page
  get filteredRetailers(): Retailer[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.retailers;
    return this.retailers.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term) ||
      r.phoneNumber.includes(term)
    );
  }

  onSearch(): void {
    this.first = 0;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.loadRetailers();
  }

  openMenu(event: Event, menu: { toggle: (e: Event) => void }, retailer: Retailer): void {
    this.selectedRetailer = retailer;
    // reflect the retailer's current status before the menu renders
    this.menuItems[2].label = retailer.status === 'ACTIVE' ? 'Deactivate' : 'Activate';
    menu.toggle(event);
  }

  toggleStatus(retailer: Retailer): void {
    const deactivating = retailer.status === 'ACTIVE';
    this.confirmationService.confirm({
      message: deactivating
        ? `Deactivate ${retailer.name}? They'll no longer appear as an active retailer. You can reactivate them anytime.`
        : `Reactivate ${retailer.name}? They'll show up as an active retailer again.`,
      acceptLabel: deactivating ? 'Deactivate' : 'Activate',
      rejectLabel: 'Cancel',
      accept: () => {
        this.retailersService
          .updateRetailerStatus(retailer.id, deactivating ? 'DEACTIVATED' : 'ACTIVE')
          .subscribe({
            next: () => {
              this.loadRetailers();
              this.loadStats();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Unable to update status',
                detail: err?.error?.message || 'Something went wrong. Please try again.'
              });
            }
          });
      }
    });
  }

  statusLabel(retailer: Retailer): string {
    return retailer.status === 'ACTIVE' ? 'Active' : 'Deactivated';
  }

  statusSeverity(retailer: Retailer): 'success' | 'danger' {
    return retailer.status === 'ACTIVE' ? 'success' : 'danger';
  }

  viewRetailer(retailer: Retailer): void {
    this.viewingRetailer = retailer;
  }

  requestDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.retailersService.deleteRetailer(id).subscribe(() => {
          // step back a page if we just deleted the last item on this page
          if (this.retailers.length === 1 && this.first > 0) {
            this.first = Math.max(0, this.first - this.pageSize);
          }
          this.loadRetailers();
          this.loadStats();
        });
      }
    });
  }
}
