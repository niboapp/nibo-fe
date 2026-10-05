import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./features/products/add-product/add-product.component').then(m => m.AddProductComponent)
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/products/add-product/add-product.component').then(m => m.AddProductComponent)
      },
      {
        path: 'retailers',
        loadComponent: () =>
          import('./features/retailers/retailer-list/retailer-list.component').then(m => m.RetailerListComponent)
      },
      {
        path: 'retailers/add',
        loadComponent: () =>
          import('./features/retailers/add-retailer/add-retailer.component').then(m => m.AddRetailerComponent)
      },
      {
        path: 'retailers/:id/edit',
        loadComponent: () =>
          import('./features/retailers/edit-retailer/edit-retailer.component').then(m => m.EditRetailerComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
    ]
  },
  {
    // No sidebar — this is a standalone onboarding screen
    path: 'add-business',
    loadComponent: () =>
      import('./features/onboarding/add-business/add-business.component').then(m => m.AddBusinessComponent)
  },
  { path: '**', redirectTo: 'overview' }
];
