import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    // No sidebar — standalone auth/onboarding screens
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'app',
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
    path: 'add-business',
    loadComponent: () =>
      import('./features/onboarding/add-business/add-business.component').then(m => m.AddBusinessComponent)
  },
  { path: '**', redirectTo: 'login' }
];
