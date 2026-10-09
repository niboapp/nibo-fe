import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { MessageService } from 'primeng/api';
import { RetailersService } from '../../../core/services/retailers.service';
import { RetailerChainResult } from '../../../core/models/retailer-chain-result.model';

@Component({
  selector: 'app-add-retailer',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, CheckboxModule, TagModule,
    PageHeaderComponent
  ],
  templateUrl: './add-retailer.component.html'
})
export class AddRetailerComponent {
  searchTerm = '';
  stateFilter = 'All States';
  readonly stateOptions = [
    'All States', 'Lagos', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Ogun', 'Ondo'
  ];
  searchResults: RetailerChainResult[] = [];
  hasSearched = false;
  selectedResultIds = new Set<string>();

  manualForm: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private retailersService: RetailersService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.manualForm = this.fb.group({
      rows: this.fb.array([this.createRow()])
    });
  }

  get rows(): FormArray {
    return this.manualForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  addRow(): void {
    this.rows.push(this.createRow());
  }

  removeRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
    }
  }

  searchChains(): void {
    this.retailersService.searchRetailerChains(this.searchTerm, this.stateFilter).subscribe(results => {
      this.searchResults = results;
      this.selectedResultIds.clear();
      this.hasSearched = true;
    });
  }

  isResultSelected(id: string): boolean {
    return this.selectedResultIds.has(id);
  }

  toggleResult(id: string): void {
    if (this.selectedResultIds.has(id)) {
      this.selectedResultIds.delete(id);
    } else {
      this.selectedResultIds.add(id);
    }
  }

  get allSelected(): boolean {
    return this.searchResults.length > 0 && this.selectedResultIds.size === this.searchResults.length;
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedResultIds.clear();
    } else {
      this.selectedResultIds = new Set(this.searchResults.map(r => r.id));
    }
  }

  goBack(): void {
    this.router.navigate(['/app/retailers']);
  }

  saveRetailers(): void {
    const manualRowsValid = this.manualForm.valid;
    const manualRows = manualRowsValid ? (this.rows.value as { name: string; location: string; phoneNumber: string }[]) : [];

    const selectedChainRows = this.searchResults
      .filter(r => this.selectedResultIds.has(r.id))
      .map(r => ({ name: r.name, location: r.address, phoneNumber: '' }));

    const rowsToSave = [...selectedChainRows, ...manualRows.filter(r => r.name || r.location || r.phoneNumber)];

    if (!rowsToSave.length) {
      this.manualForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.retailersService.saveRetailers(rowsToSave).subscribe({
      next: () => this.router.navigate(['/app/retailers']),
      error: (err) => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to save retailers',
          detail: err?.error?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }
}
