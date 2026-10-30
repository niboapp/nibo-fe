import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { ProductsService } from '../../../core/services/products.service';
import { Product, ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, InputNumberModule, DatePickerModule, TextareaModule, SelectModule, ButtonModule, SkeletonModule,
    PageHeaderComponent
  ],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  categories: ProductCategory[] = [];
  loadingCategories = true;
  imagePreviewUrl: string | null = null;
  selectedFile: File | null = null;
  loading = false;
  fetching = false;

  productId: string | null = null;
  get isEditMode(): boolean {
    return !!this.productId;
  }

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      retailPrice: [null, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      productCategoryId: ['', Validators.required],
      barcode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      batchNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_]+$/)]],
      manufacturingDate: ['', Validators.required],
      expiringDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.fetching = true;
    }

    // categories load first so a legacy product's category name can be
    // resolved back to its id in edit mode
    this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
        this.loadProduct();
      },
      error: () => {
        this.loadingCategories = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to load categories',
          detail: 'Something went wrong. Please try again.'
        });
        this.loadProduct();
      }
    });
  }

  private loadProduct(): void {
    if (!this.productId) {
      return;
    }

    this.productsService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        // docs written before product_category_id existed only carry the name
        if (!product.productCategoryId && product.productCategory) {
          const match = this.categories.find(c => c.name === product.productCategory);
          if (match) {
            this.form.patchValue({ productCategoryId: match.id });
          }
        }
        this.imagePreviewUrl = product.imageUrl || null;
        this.fetching = false;
      },
      error: (err) => {
        this.fetching = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to load product',
          detail: err?.error?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }

  get descriptionLength(): number {
    return (this.form.get('description')?.value || '').length;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.invalid || !(control.touched || control.dirty)) {
      return null;
    }
    if (control.errors?.['required']) {
      return 'Required';
    }
    if (controlName === 'barcode' && control.errors?.['pattern']) {
      return 'Numbers only';
    }
    if (controlName === 'batchNumber' && control.errors?.['pattern']) {
      return 'Alphanumeric only';
    }
    if (control.errors?.['min']) {
      return 'Min 1';
    }
    return 'Invalid';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreviewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  goBack(): void {
    this.router.navigate(['/app/products']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // the API accepts JSON — the selected image is sent as a base64 data URL
    // (imagePreviewUrl is populated by the FileReader in onFileSelected)
    const categoryId = this.form.value.productCategoryId;
    const payload: Partial<Product> = {
      ...this.form.value,
      // persist the display name alongside the category id
      productCategory: this.categories.find(c => c.id === categoryId)?.name ?? '',
      imageUrl: this.imagePreviewUrl ?? '',
    };
    this.loading = true;

    const request$ = this.isEditMode
      ? this.productsService.updateProduct(this.productId!, payload)
      : this.productsService.addProduct(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/app/products']),
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: this.isEditMode ? 'Unable to update product' : 'Unable to add product',
          detail: err?.error?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }
}
