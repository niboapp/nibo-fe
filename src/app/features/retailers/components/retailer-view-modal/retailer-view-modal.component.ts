import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Retailer } from '../../../../core/models/retailer.model';

@Component({
  selector: 'app-retailer-view-modal',
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog [visible]="true" (onHide)="close.emit()" [modal]="true" [header]="retailer.name"
              [style]="{ width: '480px' }" [draggable]="false" [resizable]="false" [closable]="true">
      <div class="flex justify-between py-2.5 text-sm border-t border-line"><span class="text-ink-2">Name</span><strong class="font-medium text-ink">{{ retailer.name }}</strong></div>
      <div class="flex justify-between py-2.5 text-sm border-t border-line"><span class="text-ink-2">Location</span><strong class="font-medium text-ink">{{ retailer.location }}</strong></div>
      <div class="flex justify-between py-2.5 text-sm border-t border-line"><span class="text-ink-2">Phone Number</span><strong class="font-medium text-ink">{{ retailer.phoneNumber }}</strong></div>
    </p-dialog>
  `
})
export class RetailerViewModalComponent {
  @Input({ required: true }) retailer!: Retailer;
  @Output() close = new EventEmitter<void>();
}
