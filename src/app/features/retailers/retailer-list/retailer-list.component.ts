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
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Retailer } from '../../../core/models/retailer.model';
import { RetailersService } from '../../../core/services/retailers.service';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { RetailerViewModalComponent } from '../components/retailer-view-modal/retailer-view-modal.component';

@Component({
  selector: 'app-retailer-list',
  imports: [
    CommonModule, FormsModule, RouterLink,
    TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, MenuModule,
    PaginatorModule,
    PageHeaderComponent, RetailerViewModalComponent
  ],
  templateUrl: './retailer-list.component.html'
})
export class RetailerListComponent implements OnInit {
  retailers: Retailer[] = [];
  searchTerm = '';
  pageSize = 10;
  first = 0;
  viewingRetailer: Retailer | null = null;
  selectedRetailer: Retailer | null = null;

  menuItems: MenuItem[];

  constructor(
    private retailersService: RetailersService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.menuItems = [
      { label: 'View', icon: 'pi pi-eye', command: () => this.selectedRetailer && this.viewRetailer(this.selectedRetailer) },
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.selectedRetailer && this.router.navigate(['/app/retailers', this.selectedRetailer.id, 'edit']) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.selectedRetailer && this.requestDelete(this.selectedRetailer.id) }
    ];
  }

  ngOnInit(): void {
    this.retailersService.getRetailers().subscribe(data => {
      this.retailers = data;
    });
  }

  get filteredRetailers(): Retailer[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.retailers;
    return this.retailers.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term) ||
      r.phoneNumber.includes(term)
    );
  }

  get pagedRetailers(): Retailer[] {
    return this.filteredRetailers.slice(this.first, this.first + this.pageSize);
  }

  onSearch(): void {
    this.first = 0;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
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
          this.retailers = this.retailers.filter(r => r.id !== id);
          if (this.first >= this.filteredRetailers.length) {
            this.first = Math.max(0, this.first - this.pageSize);
          }
        });
      }
    });
  }
}
