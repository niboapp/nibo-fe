import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { BusinessProfile } from '../../core/models/profile.model';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, ProgressBarModule, ChipsModule, TagModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile!: BusinessProfile;
  editableProfile!: BusinessProfile;
  isEditing = false;
  saving = false;

  constructor(
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.editableProfile = { ...data, productCategories: [...data.productCategories] };
      },
      error: (err) => {
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

  copyToClipboard(value: string): void {
    navigator.clipboard?.writeText(value);
  }
}
