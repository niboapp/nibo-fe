import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { BusinessProfile } from '../../core/models/profile.model';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { OnboardingTrackerComponent } from '../../shared/components/onboarding-tracker/onboarding-tracker.component';
import { BuyingOptionsModalComponent } from '../../shared/components/buying-options-modal/buying-options-modal.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule, FormsModule, InputTextModule, ButtonModule, ProgressBarModule,
    ChipsModule, TagModule, SkeletonModule, ChangePasswordModalComponent,
    OnboardingTrackerComponent, BuyingOptionsModalComponent
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile!: BusinessProfile;
  editableProfile!: BusinessProfile;
  isEditing = false;
  saving = false;
  loading = true;
  showPasswordModal = false;
  showBuyingOptionsModal = false;

  get currentUser() {
    return this.authService.currentUser();
  }

  constructor(
    private profileService: ProfileService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.editableProfile = { ...data, productCategories: [...data.productCategories] };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to load profile',
          detail: err?.error?.message || err?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }

  startEditing(): void {
    this.editableProfile = { ...this.profile, productCategories: [...this.profile.productCategories] };
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  save(): void {
    this.saving = true;
    this.profileService.updateProfile(this.editableProfile).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.isEditing = false;
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to update profile',
          detail: err?.error?.message || err?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }

  onPasswordChanged(): void {
    this.showPasswordModal = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Password changed',
      detail: 'Your password was updated. Please log in again.'
    });
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onBuyingOptionsSaved(): void {
    this.loadProfile();
  }

  copyToClipboard(value: string): void {
    if (value && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Link copied to clipboard!'
      });
    }
  }
}
