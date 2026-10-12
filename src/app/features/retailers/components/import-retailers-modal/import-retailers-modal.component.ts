import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RetailersService } from '../../../../core/services/retailers.service';

interface CsvRow {
  name: string;
  location: string;
  phoneNumber: string;
  landmark: string;
}

@Component({
  selector: 'app-import-retailers-modal',
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog [(visible)]="visible" (onHide)="close.emit()" [modal]="true" [closable]="false"
              [style]="{ width: '440px' }" [draggable]="false" [resizable]="false">
      <div class="p-2">
        <div class="flex justify-between items-start mb-5">
          <div>
            <h2 class="text-base font-bold m-0">Import Retailers</h2>
            <p class="text-xs text-ink-2 mt-1 mb-0">Upload a CSV file to add retailers in bulk</p>
          </div>
          <button type="button" (click)="visible = false"
            class="w-8 h-8 rounded-full bg-surface/80 hover:bg-surface flex items-center justify-center border-0 cursor-pointer text-ink-2">
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <div class="bg-canvas rounded-xl p-4 mb-5" style="border: 1px solid gainsboro; background: whitesmoke;">
          <p class="text-[13px] font-medium m-0 mb-1">Step 1 — Download the template</p>
          <p class="text-xs text-ink-2 mt-0 mb-3">Fill in each retailer's name, phone number, address and closest landmark.</p>
          <a href="data/retailer_nibo_sample.csv" download="retailer_nibo_sample.csv"
             class="text-brand text-[13px] font-medium no-underline inline-flex items-center gap-1.5 cursor-pointer">
            <i class="pi pi-download text-xs"></i> Download CSV template
          </a>
        </div>

        <label class="flex flex-col items-center justify-center gap-1 border border-dashed rounded-xl p-7 text-ink-2 text-sm cursor-pointer text-center mb-5" style="border: 1px solid gainsboro; color: black; font-weight: bold;"
               [class.border-brand]="selectedFile" [class.border-line]="!selectedFile">
          <input type="file" accept=".csv,text/csv" (change)="onFileSelected($event)" hidden />
          <ng-container *ngIf="!selectedFile">
            <i class="pi pi-upload text-xl"></i>
            <span>Step 2 — Upload your file</span>
            <span class="text-xs text-ink-3">CSV files only</span>
          </ng-container>
          <ng-container *ngIf="selectedFile">
            <i class="pi pi-file text-xl text-brand"></i>
            <span class="text-ink font-medium">{{ selectedFile.name }}</span>
            <span class="text-xs text-brand">Change file</span>
          </ng-container>
        </label>

        <p *ngIf="parseError" class="text-xs text-danger mt-0 mb-4">{{ parseError }}</p>

        <div class="flex justify-end gap-3">
          <p-button label="Cancel" [outlined]="true" (onClick)="visible = false" />
          <p-button label="Import" icon="pi pi-check" [disabled]="!selectedFile" [loading]="importing" (onClick)="importFile()" />
        </div>
      </div>
    </p-dialog>
  `
})
export class ImportRetailersModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() imported = new EventEmitter<number>();

  visible = true;
  importing = false;
  selectedFile: File | null = null;
  parseError = '';

  constructor(
    private retailersService: RetailersService,
    private messageService: MessageService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.parseError = '';
  }

  async importFile(): Promise<void> {
    if (!this.selectedFile) return;

    const rows = this.parseRows(await this.selectedFile.text());
    if (!rows.length) {
      this.parseError = 'No valid rows found — make sure each row has a name, phone number and address.';
      return;
    }

    this.importing = true;
    this.retailersService.saveRetailers(rows).subscribe({
      next: () => {
        this.importing = false;
        this.visible = false;
        this.imported.emit(rows.length);
      },
      error: (err) => {
        this.importing = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Import failed',
          detail: err?.error?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }

  // maps the template columns: Name, Phone Number, Address, Closest Landmark
  private parseRows(text: string): CsvRow[] {
    const rows = parseCsv(text);
    if (!rows.length) return [];

    const header = rows[0].map(h => h.trim().toLowerCase());
    const col = {
      name: header.indexOf('name'),
      phone: header.indexOf('phone number'),
      address: header.indexOf('address'),
      landmark: header.indexOf('closest landmark'),
    };
    const dataRows = col.name === -1 ? rows : rows.slice(1);

    return dataRows
      .map(r => ({
        name: (r[col.name === -1 ? 0 : col.name] ?? '').trim(),
        phoneNumber: (r[col.phone === -1 ? 1 : col.phone] ?? '').trim(),
        location: (r[col.address === -1 ? 2 : col.address] ?? '').trim(),
        landmark: (r[col.landmark === -1 ? 3 : col.landmark] ?? '').trim(),
      }))
      .filter(r => r.name && r.phoneNumber && r.location);
  }
}

// minimal CSV parser — handles quoted fields, embedded commas and CRLF
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some(c => c.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }

  row.push(field);
  if (row.some(c => c.trim() !== '')) rows.push(row);
  return rows;
}
