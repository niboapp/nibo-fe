import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { OnboardingService } from '../../../core/services/onboarding.service';

@Component({
  selector: 'app-add-business',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule],
  templateUrl: './add-business.component.html'
})
export class AddBusinessComponent implements OnInit {
  form: FormGroup;
  availableCategories: string[] = [];
  industries: string[] = [];
  selectedCategories: string[] = [];
  logoPreviewUrl: string | null = null;
  selectedLogo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router
  ) {
    this.form = this.fb.group({
      businessName: ['', Validators.required],
      storeName: ['', Validators.required],
      location: ['', Validators.required],
      industry: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.onboardingService.getAvailableCategories().subscribe(c => (this.availableCategories = c));
    this.onboardingService.getIndustries().subscribe(i => (this.industries = i));
  }

  toggleCategory(category: string): void {
    this.selectedCategories = this.selectedCategories.includes(category)
      ? this.selectedCategories.filter(c => c !== category)
      : [...this.selectedCategories, category];
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedLogo = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.logoPreviewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.router.navigate(['/app/overview']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.form.value, categories: this.selectedCategories };
    this.onboardingService.submitBusiness(payload, this.selectedLogo).subscribe(() => {
      this.router.navigate(['/app/overview']);
    });
  }
}
