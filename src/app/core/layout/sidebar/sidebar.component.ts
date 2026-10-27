import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
          <a routerLink="/app/overview" routerLinkActive #overviewLink="routerLinkActive"
             [ngClass]="overviewLink.isActive ? 'bg-brand-light text-brand' : 'text-ink-2 hover:bg-canvas'"
             class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline">
            <i class="pi pi-home"></i>
            <span>Overview</span>
          </a>

          <a routerLink="/app/products" routerLinkActive #productsLink="routerLinkActive"
             [ngClass]="productsLink.isActive ? 'bg-brand-light text-brand' : 'text-ink-2 hover:bg-canvas'"
             class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline">
            <i class="pi pi-box"></i>
            <span>Products</span>
          </a>

          <a routerLink="/app/retailers" routerLinkActive #retailersLink="routerLinkActive"
             [ngClass]="retailersLink.isActive ? 'bg-brand-light text-brand' : 'text-ink-2 hover:bg-canvas'"
             class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline">
            <i class="pi pi-th-large"></i>
            <span>Retailers</span>
          </a>
        </nav>
      </div>

      <div class="border-t border-line pt-4 flex flex-col gap-3">
        <a routerLink="/app/profile"
           class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg no-underline text-ink hover:bg-canvas">
          <span class="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs font-semibold shrink-0">{{ userInitials() }}</span>
          <span class="text-sm font-medium truncate">{{ userName() }}</span>
        </a>
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
  private authService = inject(AuthService);

  @Input() orgName?: string;
  @Input() orgInitials?: string;
  @Output() logout = new EventEmitter<void>();

  readonly currentUser = this.authService.currentUser;

  readonly userName = computed(() => {
    if (this.orgName) return this.orgName;
    const user = this.currentUser();
    return user?.full_name?.trim() || user?.email || 'User';
  });

  readonly userInitials = computed(() => {
    if (this.orgInitials) return this.orgInitials;
    const name = this.userName();
    if (!name || name === 'User') {
      const user = this.currentUser();
      if (!user?.full_name && user?.email) {
        return user.email[0].toUpperCase();
      }
      return 'U';
    }
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    return parts
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  });
}
