import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Organization } from '../../../core/models/auth.model';
import { BuyingOptionsModalComponent } from '../buying-options-modal/buying-options-modal.component';

export interface OnboardingStatus {
  hasProfile: boolean;
  hasProducts: boolean;
  hasRetailers: boolean;
  hasBuyingOptions: boolean;
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  isUnlocked: boolean;
  storeUrl: string;
}

@Component({
  selector: 'app-onboarding-tracker',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProgressBarModule,
    ButtonModule,
    BuyingOptionsModalComponent
  ],
  template: `
    <div class="card p-6 mb-6">
      <!-- Header row with Progress -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div class="inline-flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full" [ngClass]="status.isUnlocked ? 'bg-success' : 'bg-warning'"></span>
            <span class="text-xs font-semibold uppercase tracking-wider text-ink-2">Store Activation Onboarding</span>
          </div>
          <h2 class="text-lg font-bold text-ink m-0">
            {{ status.isUnlocked ? '🎉 Store URL Activated!' : 'Complete your setup to unlock your Where to Buy Store URL' }}
          </h2>
          <p class="text-xs text-ink-2 mt-1 mb-0">
            {{ status.completedSteps }} of {{ status.totalSteps }} onboarding requirements completed
          </p>
        </div>

        <div class="sm:text-right min-w-[180px]">
          <span class="text-sm font-bold" [ngClass]="status.isUnlocked ? 'text-success' : 'text-brand'">
            {{ status.progressPercent }}% Complete
          </span>
          <p-progressbar [value]="status.progressPercent" [showValue]="false" [style]="{ height: '6px' }"
                         styleClass="mt-1.5 block" />
        </div>
      </div>

      <!-- 4 Step Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <!-- Step 1: Business Profile (Cannot Skip) -->
        <div class="rounded-xl p-4 border transition-all"
             [ngClass]="status.hasProfile ? 'bg-emerald-50/60 border-emerald-200' : 'bg-surface border-line'">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                  [ngClass]="status.hasProfile ? 'bg-emerald-100 text-emerald-700' : 'bg-canvas text-ink-2'">
              Step 1 • Required
            </span>
            <i class="pi" [ngClass]="status.hasProfile ? 'pi-check-circle text-success text-base' : 'pi-circle text-ink-3'"></i>
          </div>
          <h3 class="text-sm font-bold text-ink m-0">Business Profile</h3>
          <p class="text-xs text-ink-2 mt-1 mb-3">Brand name, store name, address, and logo.</p>
          <div class="mt-auto">
            <span *ngIf="status.hasProfile" class="text-xs text-success font-semibold flex items-center gap-1">
              <i class="pi pi-check text-[10px]"></i> Completed
            </span>
            <a *ngIf="!status.hasProfile" routerLink="/add-business"
               class="text-xs text-brand font-semibold no-underline inline-flex items-center gap-1 hover:underline">
              Add Profile <i class="pi pi-arrow-right text-[10px]"></i>
            </a>
          </div>
        </div>

        <!-- Step 2: Add Product (Can Skip) -->
        <div class="rounded-xl p-4 border transition-all"
             [ngClass]="status.hasProducts ? 'bg-emerald-50/60 border-emerald-200' : 'bg-surface border-line'">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                  [ngClass]="status.hasProducts ? 'bg-emerald-100 text-emerald-700' : 'bg-canvas text-ink-2'">
              Step 2 • {{ productsCount }} Added
            </span>
            <i class="pi" [ngClass]="status.hasProducts ? 'pi-check-circle text-success text-base' : 'pi-circle text-ink-3'"></i>
          </div>
          <h3 class="text-sm font-bold text-ink m-0">Add a Product</h3>
          <p class="text-xs text-ink-2 mt-1 mb-3">At least 1 authentic product in your catalog.</p>
          <div class="mt-auto flex items-center justify-between">
            <span *ngIf="status.hasProducts" class="text-xs text-success font-semibold flex items-center gap-1">
              <i class="pi pi-check text-[10px]"></i> {{ productsCount }} in Catalog
            </span>
            <a *ngIf="!status.hasProducts" routerLink="/app/products/add"
               class="text-xs text-brand font-semibold no-underline inline-flex items-center gap-1 hover:underline">
              Add Product <i class="pi pi-arrow-right text-[10px]"></i>
            </a>
            <span *ngIf="!status.hasProducts" class="text-[11px] text-ink-3">Can skip</span>
          </div>
        </div>

        <!-- Step 3: Add Retailer (Can Skip) -->
        <div class="rounded-xl p-4 border transition-all"
             [ngClass]="status.hasRetailers ? 'bg-emerald-50/60 border-emerald-200' : 'bg-surface border-line'">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                  [ngClass]="status.hasRetailers ? 'bg-emerald-100 text-emerald-700' : 'bg-canvas text-ink-2'">
              Step 3 • {{ retailersCount }} Added
            </span>
            <i class="pi" [ngClass]="status.hasRetailers ? 'pi-check-circle text-success text-base' : 'pi-circle text-ink-3'"></i>
          </div>
          <h3 class="text-sm font-bold text-ink m-0">Add a Retailer</h3>
          <p class="text-xs text-ink-2 mt-1 mb-3">At least 1 verified retail partner location.</p>
          <div class="mt-auto flex items-center justify-between">
            <span *ngIf="status.hasRetailers" class="text-xs text-success font-semibold flex items-center gap-1">
              <i class="pi pi-check text-[10px]"></i> {{ retailersCount }} Active
            </span>
            <a *ngIf="!status.hasRetailers" routerLink="/app/retailers/add"
               class="text-xs text-brand font-semibold no-underline inline-flex items-center gap-1 hover:underline">
              Add Retailer <i class="pi pi-arrow-right text-[10px]"></i>
            </a>
            <span *ngIf="!status.hasRetailers" class="text-[11px] text-ink-3">Can skip</span>
          </div>
        </div>

        <!-- Step 4: Buying Options -->
        <div class="rounded-xl p-4 border transition-all"
             [ngClass]="status.hasBuyingOptions ? 'bg-emerald-50/60 border-emerald-200' : 'bg-surface border-line'">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                  [ngClass]="status.hasBuyingOptions ? 'bg-emerald-100 text-emerald-700' : 'bg-canvas text-ink-2'">
              Step 4 • Channel Setup
            </span>
            <i class="pi" [ngClass]="status.hasBuyingOptions ? 'pi-check-circle text-success text-base' : 'pi-circle text-ink-3'"></i>
          </div>
          <h3 class="text-sm font-bold text-ink m-0">Buying Options</h3>
          <p class="text-xs text-ink-2 mt-1 mb-3">WhatsApp ordering and/or online store links.</p>
          <div class="mt-auto">
            <button type="button" (click)="showBuyingOptionsModal = true"
                    class="bg-transparent border-0 p-0 text-xs text-brand font-semibold cursor-pointer inline-flex items-center gap-1 hover:underline">
              {{ status.hasBuyingOptions ? 'Edit Options' : 'Configure Options' }}
              <i class="pi pi-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Store URL Card (Locked vs Unlocked) -->
      <div class="rounded-xl p-4 sm:p-5 border"
           [ngClass]="status.isUnlocked ? 'bg-brand-light/70 border-brand/40' : 'bg-canvas border-line'">
        <!-- UNLOCKED STATE -->
        <div *ngIf="status.isUnlocked" class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center text-lg shrink-0">
              <i class="pi pi-link"></i>
            </span>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-ink m-0">Your Public Where to Buy Store URL</h4>
                <span class="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p class="text-xs text-ink-2 mt-0.5 mb-0">Share this link across social channels, campaigns, and packaging to direct consumers to authentic channels</p>
            </div>
          </div>

          <div class="flex items-center gap-2 max-w-md w-full md:w-auto">
            <input type="text" [value]="status.storeUrl" readonly
                   class="bg-surface border border-line rounded-lg px-3 py-2 text-xs font-mono text-ink flex-1 truncate select-all" />
            <p-button icon="pi pi-copy" label="Copy Link" (onClick)="copyStoreUrl()" [outlined]="true" />
            <a [href]="status.storeUrl" target="_blank"
               class="px-3.5 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-semibold no-underline inline-flex items-center gap-1.5 transition-colors">
              <i class="pi pi-external-link text-xs"></i> Visit
            </a>
          </div>
        </div>

        <!-- LOCKED STATE -->
        <div *ngIf="!status.isUnlocked" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-surface border border-line text-ink-3 flex items-center justify-center text-lg shrink-0">
              <i class="pi pi-lock"></i>
            </span>
            <div>
              <h4 class="text-sm font-bold text-ink m-0">Where to Buy Store URL is Locked</h4>
              <p class="text-xs text-ink-2 mt-0.5 mb-0">
                To generate your public Where to Buy link, you must complete your profile, add at least 1 product, 1 retailer, and buying options.
              </p>
            </div>
          </div>

          <div class="inline-flex items-center gap-2 text-xs font-medium text-ink-2 shrink-0">
            <i class="pi pi-info-circle text-warning"></i>
            <span>{{ status.totalSteps - status.completedSteps }} requirement(s) remaining</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Buying Options Modal -->
    <app-buying-options-modal
      *ngIf="showBuyingOptionsModal"
      [visible]="showBuyingOptionsModal"
      (close)="showBuyingOptionsModal = false"
      (saved)="onBuyingOptionsSaved()"
    />
  `
})
export class OnboardingTrackerComponent implements OnInit {
  @Input() organization?: Organization | null;
  @Input() productsCount = 0;
  @Input() retailersCount = 0;
  @Output() updated = new EventEmitter<void>();

  showBuyingOptionsModal = false;

  private messageService = inject(MessageService);

  get status(): OnboardingStatus {
    const org = this.organization;
    const hasProfile = !!(org?.name && org?.store_name && org?.business_address);
    const hasProducts = this.productsCount >= 1;
    const hasRetailers = this.retailersCount >= 1;
    const buying = org?.buying_options;
    const hasBuyingOptions = !!(
      buying?.whatsapp_number ||
      (buying?.company_website && buying?.ecommerce_stores && buying.ecommerce_stores.length > 0) ||
      org?.phone_number ||
      org?.business_url
    );

    const totalSteps = 4;
    const completedSteps = [hasProfile, hasProducts, hasRetailers, hasBuyingOptions].filter(Boolean).length;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);

    const isUnlocked = hasProfile && hasProducts && hasRetailers && hasBuyingOptions;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nibo.app';
    const username = org?.username
      || (org?.store_name ? org.store_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
      || (org?.name ? org.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
      || org?._id
      || 'store';

    const storeUrl = `${origin}/where2buy/${username}`;

    return {
      hasProfile,
      hasProducts,
      hasRetailers,
      hasBuyingOptions,
      completedSteps,
      totalSteps,
      progressPercent,
      isUnlocked,
      storeUrl
    };
  }

  ngOnInit(): void {}

  copyStoreUrl(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.status.storeUrl);
      this.messageService.add({
        severity: 'success',
        summary: 'Link Copied',
        detail: 'Store URL copied to clipboard!'
      });
    }
  }

  onBuyingOptionsSaved(): void {
    this.updated.emit();
  }
}
