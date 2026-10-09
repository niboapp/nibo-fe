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
import { Retailer } from '../../../core/models/retailer.model';
import { RetailersService } from '../../../core/services/retailers.service';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { RetailerViewModalComponent } from '../components/retailer-view-modal/retailer-view-modal.component';

@Component({
  selector: 'app-retailer-list',
  imports: [
    CommonModule, FormsModule, RouterLink,
    TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, MenuModule,
    PaginatorModule, SkeletonModule,
    PageHeaderComponent, RetailerViewModalComponent
  ],
  templateUrl: './retailer-list.component.html'
})
export class RetailerListComponent implements OnInit {
  retailers: Retailer[] = [];
  retailerTotal = 0;
  loading = true;
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
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.selectedRetailer && this.requestDelete(this.selectedRetailer.id) }
    ];
  }

  ngOnInit(): void {
    this.loadRetailers();
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
    menu.toggle(event);
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
        });
      }
    });
  }
}
