import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { BuyingOptions, EcommerceStore } from '../../../core/models/auth.model';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-buying-options-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule
  ],
  template: `
    <p-dialog [(visible)]="visible" (onHide)="close.emit()" [modal]="true" [closable]="false"
              [style]="{ width: '580px', maxWidth: '95vw' }" [draggable]="false" [resizable]="false">
      <div class="p-2">
        <!-- Header -->
        <div class="flex justify-between items-start mb-5">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-light text-brand text-xs font-semibold mb-1.5">
              <i class="pi pi-shopping-bag text-[11px]"></i>
              <span>Step 4 of Onboarding</span>
            </div>
            <h2 class="text-lg font-bold text-ink m-0">Configure Buying Options</h2>
            <p class="text-xs text-ink-2 mt-1 mb-0">Direct consumers to authentic offline and online channels to buy your products</p>
          </div>
          <button type="button" (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-surface hover:bg-canvas flex items-center justify-center border border-line cursor-pointer text-ink-2">
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-5 max-h-[65vh] overflow-y-auto px-1">
          <!-- Offline: WhatsApp CTA -->
          <div class="card p-4 bg-canvas/30">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <i class="pi pi-whatsapp"></i>
              </span>
              <div>
                <h3 class="text-sm font-bold text-ink m-0">Offline Channel — WhatsApp Ordering</h3>
                <p class="text-xs text-ink-2 m-0">Enables a direct "Chat on WhatsApp" CTA on your store</p>
              </div>
            </div>

            <div class="mt-3">
              <label class="field-label">WhatsApp Business Number</label>
              <input pInputText type="text" placeholder="e.g. +234 801 234 5678" formControlName="whatsappNumber" class="w-full" />
              <span class="text-[11px] text-ink-3 mt-1 block">Customers can click this on your store to message your sales team directly</span>
            </div>
          </div>

          <!-- Online: Website & E-commerce -->
          <div class="card p-4 bg-canvas/30">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                <i class="pi pi-globe"></i>
              </span>
              <div>
                <h3 class="text-sm font-bold text-ink m-0">Online Channels — Website & Existing Stores</h3>
                <p class="text-xs text-ink-2 m-0">Where consumers can purchase your products online</p>
              </div>
            </div>

            <div class="mt-3">
              <label class="field-label">Official Company Website</label>
              <input pInputText type="url" placeholder="https://yourbrand.com" formControlName="companyWebsite" class="w-full" />
            </div>

            <div class="mt-4 pt-3 border-t border-line">
              <div class="flex justify-between items-center mb-2">
                <label class="field-label m-0">Online Stores (Shopify, Selar, Bumpa, etc.)</label>
                <button type="button" (click)="addStore()" class="bg-transparent border-0 text-brand text-xs font-semibold cursor-pointer flex items-center gap-1 hover:underline">
                  <i class="pi pi-plus text-[10px]"></i> Add Store
                </button>
              </div>

              <div formArrayName="ecommerceStores" class="flex flex-col gap-2.5">
                <div *ngFor="let storeGroup of ecommerceStores.controls; let i = index" [formGroupName]="i"
                     class="flex items-center gap-2">
                  <p-select [options]="platformOptions" formControlName="platform" placeholder="Platform" styleClass="w-36 shrink-0" />
                  <input pInputText type="url" placeholder="https://store.com/..." formControlName="url" class="flex-1" />
                  <button type="button" (click)="removeStore(i)"
                          class="w-8 h-8 rounded-lg bg-surface border border-line text-ink-3 hover:text-danger flex items-center justify-center cursor-pointer shrink-0">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>

                <div *ngIf="!ecommerceStores.length" class="text-center py-4 border border-dashed border-line rounded-lg text-ink-3 text-xs bg-surface">
                  No stores added yet. Click <strong>Add Store</strong> to link Shopify, Selar, Bumpa, etc.
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex justify-end gap-3 pt-3 border-t border-line">
            <p-button label="Cancel" [outlined]="true" (onClick)="close.emit()" />
            <p-button label="Save Buying Options" type="submit" [loading]="loading" icon="pi pi-check" />
          </div>
        </form>
      </div>
    </p-dialog>
  `
})
export class BuyingOptionsModalComponent implements OnInit {
  @Input() visible = true;
  @Input() initialOptions?: BuyingOptions;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<BuyingOptions>();

  private fb = inject(FormBuilder);
  private onboardingService = inject(OnboardingService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  form!: FormGroup;
  loading = false;

  readonly platformOptions = [
    'Shopify',
    'Selar',
    'Bumpa',
    'WooCommerce',
    'Jumia',
    'Konga',
    'Amazon',
    'Custom Store'
  ];

  get ecommerceStores(): FormArray {
    return this.form.get('ecommerceStores') as FormArray;
  }

  ngOnInit(): void {
    const existing = this.initialOptions
      ?? this.authService.currentUser()?.organization?.buying_options;

    this.form = this.fb.group({
      whatsappNumber: [existing?.whatsapp_number ?? this.authService.currentUser()?.organization?.phone_number ?? ''],
      companyWebsite: [existing?.company_website ?? this.authService.currentUser()?.organization?.business_url ?? ''],
      ecommerceStores: this.fb.array([])
    });

    if (existing?.ecommerce_stores && existing.ecommerce_stores.length) {
      existing.ecommerce_stores.forEach((s: EcommerceStore) => this.addStore(s.platform, s.url));
    }
  }

  addStore(platform = 'Shopify', url = ''): void {
    this.ecommerceStores.push(
      this.fb.group({
        platform: [platform, Validators.required],
        url: [url, Validators.required]
      })
    );
  }

  removeStore(index: number): void {
    this.ecommerceStores.removeAt(index);
  }

  submit(): void {
    const raw = this.form.value;
    const stores: EcommerceStore[] = (raw.ecommerceStores || []).filter(
      (s: { platform?: string; url?: string }) => s.url && s.url.trim()
    );

    const options: BuyingOptions = {
      whatsapp_number: (raw.whatsappNumber || '').trim(),
      company_website: (raw.companyWebsite || '').trim(),
      ecommerce_stores: stores
    };

    this.loading = true;
    this.onboardingService.updateBuyingOptions(options).subscribe({
      next: (_updatedOrg) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Buying Options Saved',
          detail: 'Your offline and online purchase channels have been configured.'
        });
        this.saved.emit(options);
        this.close.emit();
      },
      error: (err: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Save',
          detail: err?.message || 'Unable to update buying options. Please try again.'
        });
      }
    });
  }
}
