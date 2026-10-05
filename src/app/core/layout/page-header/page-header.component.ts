import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-start mb-6">
      <div>
        <button *ngIf="showBack" type="button" (click)="back.emit()"
                class="bg-transparent border-0 text-ink-2 hover:text-ink cursor-pointer mb-2 p-0">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1 class="text-xl font-bold m-0">{{ title }}</h1>
        <p class="text-sm text-ink-2 mt-1 mb-0">{{ subtitle }}</p>
      </div>
      <div class="flex gap-3">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showBack = false;
  @Output() back = new EventEmitter<void>();
}
