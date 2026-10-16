import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-business',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule],
  templateUrl: './add-business.component.html'
})

// just adding comments

export class AddBusinessComponent implements OnInit {
  form: FormGroup;
  industries: string[] = [];
  logoPreviewUrl: string | null = null;
  selectedLogo: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private authService: AuthService,
    private messageService: MessageService,
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
    this.onboardingService.getIndustries().subscribe(i => (this.industries = i));

    // prefill whatever the organization already has (reopened via completeness CTA)
    const org = this.authService.currentUser()?.organization;
    if (org) {
      this.form.patchValue({
        businessName: org.name ?? '',
        storeName: org.store_name ?? '',
        location: org.business_address ?? '',
        industry: org.industry ?? '',
      });
      this.logoPreviewUrl = org.business_logo || null;
    }
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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.form.value };
    // logoPreviewUrl already holds the image as a base64 data URL — sent as business_logo
    this.loading = true;
    this.onboardingService.submitBusiness(payload, this.logoPreviewUrl).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Business Profile Created',
          detail: 'Great! Next, complete your products, retailers, and buying options to unlock your store link.'
        });
        this.router.navigate(['/app/overview']);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to save business',
          detail: err?.error?.message || err?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }
}
