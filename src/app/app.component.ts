import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],
  template: `
    <router-outlet></router-outlet>
    <p-confirmdialog></p-confirmdialog>
    <p-toast></p-toast>
  `
})
export class AppComponent {}
