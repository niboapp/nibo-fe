/// <reference types="google.maps" />
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
import { GooglePlacesAutocompleteDirective } from '../../../shared/directives/google-places-autocomplete.directive';
import { NigeriaGeoService } from '../../../core/services/nigeria-geo.service';
declare var google: any;

@Component({
  selector: 'app-add-retailer',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, CheckboxModule, TagModule,
    PageHeaderComponent, GooglePlacesAutocompleteDirective
  ],
  templateUrl: './add-retailer.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    .chain-place-search { flex: 1; min-width: 0; }
    .chain-place-search input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      font: inherit;
      font-size: 14px;
      color: var(--color-ink, #1A1A1A);
      background: transparent;
      border: 0;
      outline: none;
      transition: border-color .15s;
    }
    .chain-place-search input::placeholder { color: var(--color-ink-3, #98A2B3); }
    .chain-place-search input:focus { border-color: var(--color-brand, #F606BA); }
    /* Places UI Kit auto-adapts to the OS theme — pin the component to light */
    gmp-place-autocomplete {
      display: block;
      width: 100%;
      color-scheme: light;
      background: var(--color-surface, #fff);
      border: 1px solid var(--color-line, #E4E7EC);
      border-radius: 10px;
      transition: border-color .15s;
    }
    gmp-place-autocomplete:focus-within { border-color: var(--color-brand, #F606BA); }
  `]
})
export class AddRetailerComponent implements AfterViewInit {
  @ViewChild('chainPlaceSearch') chainPlaceSearch?: ElementRef<HTMLElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  searchTerm = '';
  selectedPlaceAddress = '';
  stateFilter = 'All States';
  stateOptions = ['All States'];
  searchResults: RetailerChainResult[] = [];
  hasSearched = false;
  selectedResultIds = new Set<string>();

  manualForm: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private retailersService: RetailersService,
    private nigeriaGeo: NigeriaGeoService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.manualForm = this.fb.group({
      rows: this.fb.array([this.createRow()])
    });
    this.nigeriaGeo.getStateNames().subscribe(names => {
      this.stateOptions = ['All States', ...names];
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

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.chainPlaceSearch) return;
    const el = this.chainPlaceSearch.nativeElement as HTMLElement & { includedCountryCodes?: string[] };
    el.includedCountryCodes = ['ng'];
  }

  // gmp-select hands back a PlacePrediction — toPlace() + fetchFields pulls
  // the details we care about before using it.
  async onChainPlaceSelected(event: Event): Promise<void> {
    const prediction = (event as unknown as { placePrediction?: google.maps.places.PlacePrediction }).placePrediction;
    if (!prediction) return;

    const place = prediction.toPlace();
    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });

    const name = (place.displayName as unknown as { text?: string })?.text
      ?? (place.displayName as unknown as string)
      ?? '';
    this.searchTerm = name;
    this.selectedPlaceAddress = place.formattedAddress ?? '';

    // coordinates are available via place.location (LatLng) for future
    // distance/branch-radius logic
    this.searchChains();
  }

  onLocationSelected(place: google.maps.places.PlaceResult, index: number): void {
    const row = this.rows.at(index);
    if (row && place.formatted_address) {
      row.patchValue({ location: place.formatted_address });
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
