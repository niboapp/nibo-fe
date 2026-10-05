import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-view-modal',
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog [visible]="true" (onHide)="close.emit()" [modal]="true"
              [style]="{ width: '560px' }" [draggable]="false" [resizable]="false" [closable]="true">
      <div class="pb-4">
        <div class="relative min-h-[200px] bg-gradient-to-b from-[#F5F5F5] to-white flex items-end px-6 py-5 rounded-t-xl">
          <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name"
               class="absolute top-0 right-6 max-h-[180px] object-contain" />
          <div>
            <span class="bg-[#EEE] rounded-full px-2.5 py-0.5 text-[11px]">{{ product.batchNumber }}</span>
            <h2 class="text-xl font-bold my-2">{{ product.name }}</h2>
            <p class="text-[13px] text-ink-2 m-0">{{ product.description }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 p-6">
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center font-bold">₦</span>
            <div><label class="text-xs text-ink-2 block">Retail Price</label><strong class="text-[15px]">₦{{ product.retailPrice | number }}</strong></div>
          </div>
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center"><i class="pi pi-box"></i></span>
            <div><label class="text-xs text-ink-2 block">Stock Quantity</label><strong class="text-[15px]">{{ product.quantity | number }}</strong></div>
          </div>
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center font-bold">#</span>
            <div><label class="text-xs text-ink-2 block">Batch Number</label><strong class="text-[15px]">{{ product.batchNumber }}</strong></div>
          </div>
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center"><i class="pi pi-chart-line"></i></span>
            <div><label class="text-xs text-ink-2 block">Stock Value</label><strong class="text-[15px]">₦{{ product.retailPrice * product.quantity | number }}</strong></div>
          </div>
        </div>

        <div class="px-6">
          <h3 class="text-xs text-ink-3 tracking-wider mb-3 font-semibold">PRODUCT DETAILS</h3>
          <div class="flex justify-between py-2 text-sm border-t border-line"><span class="text-ink-2">Product ID</span><strong class="font-medium">#{{ product.id }}</strong></div>
          <div class="flex justify-between py-2 text-sm border-t border-line" *ngIf="product.category"><span class="text-ink-2">Category</span><strong class="font-medium">{{ product.category }}</strong></div>
          <div class="flex justify-between py-2 text-sm border-t border-line" *ngIf="product.dateAdded"><span class="text-ink-2">Date Added</span><strong class="font-medium">{{ product.dateAdded }}</strong></div>
        </div>
      </div>
    </p-dialog>
  `
})
export class ProductViewModalComponent {
  @Input({ required: true }) product!: Product;
  @Output() close = new EventEmitter<void>();
}
