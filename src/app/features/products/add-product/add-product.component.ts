import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-add-product',
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, InputNumberModule, DatePickerModule, TextareaModule, ButtonModule,
    PageHeaderComponent
  ],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  imagePreviewUrl: string | null = null;
  selectedFile: File | null = null;

  productId: string | null = null;
  get isEditMode(): boolean {
    return !!this.productId;
  }

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      retailPrice: [null, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      barcode: ['', Validators.required],
      batchNumber: ['', Validators.required],
      manufacturingDate: ['', Validators.required],
      expiringDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productsService.getProduct(this.productId).subscribe(product => {
        this.form.patchValue(product);
        this.imagePreviewUrl = product.imageUrl || null;
      });
    }
  }

  get descriptionLength(): number {
    return (this.form.get('description')?.value || '').length;
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
    this.router.navigate(['/products']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => formData.append(key, value as string));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request$ = this.isEditMode
      ? this.productsService.updateProduct(this.productId!, formData)
      : this.productsService.addProduct(formData);

    request$.subscribe(() => {
      this.router.navigate(['/products']);
    });
  }
}
