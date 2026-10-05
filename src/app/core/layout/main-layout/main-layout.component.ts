import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar />
      <main class="flex-1 h-screen overflow-y-auto px-10 py-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class MainLayoutComponent {}
