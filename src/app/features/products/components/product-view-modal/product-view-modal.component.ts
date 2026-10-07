import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-view-modal',
  imports: [CommonModule, DialogModule, CardModule],
  template: `
    <p-dialog [(visible)]="visible" (onHide)="close.emit()" [modal]="true" [closable]="false"
              styleClass="product-view-dialog" [style]="{ width: '560px' }" [draggable]="false" [resizable]="false">
      <p-card styleClass="product-view-card">

        <ng-template pTemplate="header">
          <div class="relative h-[290px]"
               [style.background]="'url(' + product.imageUrl + ') no-repeat center center'"
               [style.backgroundSize]="'cover'">
            <div style="width: 100%; height: 100%; background: #00000045;">
              <div class="absolute bottom-5 left-0 max-w-[62%]" style="padding: 2rem">
                <span class="bg-[#E7E8EB] text-ink-2 rounded-full px-2.5 py-1 text-[11px]" style="background: #000000a3; color: #fff;">{{ product.batchNumber }}</span>
                <h2 class="text-xl font-bold mt-2.5 mb-1.5" style="color: black">{{ product.name }}</h2>
                <p class="text-[13px] m-0" style="color: black">{{ product.description }}</p>
              </div>
            </div>
          </div>
          <button type="button" (click)="visible = false"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface/80 hover:bg-surface flex items-center justify-center border-0 cursor-pointer text-ink-2">
            <i class="pi pi-times text-sm"></i>
          </button>
        </ng-template>

        <div class="grid grid-cols-2 gap-4 px-10 pt-10">
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-[#ECFDF3] text-success flex items-center justify-center font-bold">₦</span>
            <div><label class="text-xs text-ink-2 block">Retail Price</label><strong class="text-[15px]">₦{{ product.retailPrice | number }}</strong></div>
          </div>
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center"><i class="pi pi-database"></i></span>
            <div><label class="text-xs text-ink-2 block">Stock Quantity</label><strong class="text-[15px]">{{ product.quantity | number }}</strong></div>
          </div>
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-[#FFFAEB] text-warning flex items-center justify-center font-bold">#</span>
            <div><label class="text-xs text-ink-2 block">Batch Number</label><strong class="text-[15px]">{{ product.batchNumber }}</strong></div>
          </div>
          <div class="flex items-center gap-3 bg-canvas rounded-xl p-3.5">
            <span class="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center"><i class="pi pi-chart-line"></i></span>
            <div><label class="text-xs text-ink-2 block">Stock Value</label><strong class="text-[15px]">₦{{ product.retailPrice * product.quantity | number }}</strong></div>
          </div>
        </div>

        <div class="px-6 py-6" style="border-top: 1px solid gainsboro; margin-top: 2rem">
          <h3 class="text-xs text-ink-3 tracking-wider mb-1 font-semibold">PRODUCT DETAILS</h3>
          <div class="flex justify-between py-2.5 text-sm"><span class="text-ink-2">Product ID</span><strong class="font-medium">#{{ product.id }}</strong></div>
          <div class="flex justify-between py-2.5 text-sm" *ngIf="product.category"><span class="text-ink-2">Category</span><strong class="font-medium">{{ product.category }}</strong></div>
          <div class="flex justify-between py-2.5 text-sm" *ngIf="product.dateAdded"><span class="text-ink-2">Date Added</span><strong class="font-medium">{{ product.dateAdded }}</strong></div>
        </div>
      </p-card>
    </p-dialog>
  `
})
export class ProductViewModalComponent {
  @Input({ required: true }) product!: Product;
  @Output() close = new EventEmitter<void>();
  visible = true;
}
