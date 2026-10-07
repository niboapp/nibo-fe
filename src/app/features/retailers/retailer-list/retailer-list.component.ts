import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
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
    PageHeaderComponent, RetailerViewModalComponent
  ],
  templateUrl: './retailer-list.component.html'
})
export class RetailerListComponent implements OnInit {
  retailers: Retailer[] = [];
  searchTerm = '';
  readonly globalFilterFields = ['name', 'location', 'phoneNumber'];
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

  onSearch(table: Table): void {
    table.filterGlobal(this.searchTerm, 'contains');
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
        });
      }
    });
  }
}
