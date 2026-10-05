import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="w-60 shrink-0 h-screen sticky top-0 overflow-y-auto bg-surface border-r border-line flex flex-col justify-between px-4 py-6">
      <div>
        <div class="text-[22px] font-extrabold px-2 pb-6">
          <!--<span class="text-ink">nibo</span><span class="text-brand">.</span>-->
          <img src="images/logo.png" alt="nibo" class="h-8">
        </div>

        <nav class="flex flex-col gap-1">
          <a routerLink="/overview" routerLinkActive #overviewLink="routerLinkActive"
             [ngClass]="overviewLink.isActive ? 'bg-brand-light text-brand' : 'text-ink-2 hover:bg-canvas'"
             class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline">
            <i class="pi pi-home"></i>
            <span>Overview</span>
          </a>

          <a routerLink="/products" routerLinkActive #productsLink="routerLinkActive"
             [ngClass]="productsLink.isActive ? 'bg-brand-light text-brand' : 'text-ink-2 hover:bg-canvas'"
             class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline">
            <i class="pi pi-box"></i>
            <span>Products</span>
          </a>

          <a routerLink="/retailers" routerLinkActive #retailersLink="routerLinkActive"
             [ngClass]="retailersLink.isActive ? 'bg-brand-light text-brand' : 'text-ink-2 hover:bg-canvas'"
             class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline">
            <i class="pi pi-th-large"></i>
            <span>Retailers</span>
          </a>
        </nav>
      </div>

      <div class="border-t border-line pt-4 flex flex-col gap-3">
        <div class="flex items-center gap-2.5 px-2">
          <span class="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs font-semibold">{{ orgInitials }}</span>
          <span class="text-sm font-medium">{{ orgName }}</span>
        </div>
        <button type="button" (click)="logout.emit()"
                class="flex items-center gap-2.5 px-2 py-2 text-sm text-ink bg-transparent border-0 cursor-pointer">
          <i class="pi pi-sign-out"></i>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  // In production these come from an AuthService/UserService — not hardcoded
  @Input() orgName = '';
  @Input() orgInitials = '';
  @Output() logout = new EventEmitter<void>();
}
