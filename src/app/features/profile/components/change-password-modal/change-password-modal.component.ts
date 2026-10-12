import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

const matchValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null =>
  c.get('newPassword')?.value !== c.get('confirmPassword')?.value ? { mismatch: true } : null;

@Component({
  selector: 'app-change-password-modal',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, PasswordModule, ButtonModule],
  template: `
    <p-dialog [visible]="true" (onHide)="close.emit()" [modal]="true" [closable]="false"
              [style]="{ width: '400px' }" [draggable]="false" [resizable]="false">
      <div class="p-2">
        <h2 class="text-base font-bold mt-0 mb-1">Change Password</h2>
        <p class="text-xs text-ink-2 mt-0 mb-5">You'll be logged out after changing your password.</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-4">
            <label class="field-label">Old Password</label>
            <p-password formControlName="oldPassword" [feedback]="false" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full" />
          </div>
          <div class="mb-4">
            <label class="field-label">New Password</label>
            <p-password formControlName="newPassword" [feedback]="false" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full" />
            <small class="text-danger" *ngIf="isInvalid('newPassword')">Must be at least 6 characters</small>
          </div>
          <div class="mb-5">
            <label class="field-label">Confirm Password</label>
            <p-password formControlName="confirmPassword" [feedback]="false" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full" />
            <small class="text-danger" *ngIf="form.hasError('mismatch') && form.get('confirmPassword')?.touched">Passwords do not match</small>
          </div>
          <div class="flex justify-end gap-3">
            <p-button label="Cancel" [outlined]="true" (onClick)="close.emit()" />
            <p-button label="Change" type="submit" [disabled]="form.invalid" [loading]="loading" />
          </div>
        </form>
      </div>
    </p-dialog>
  `
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: matchValidator });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService
      .changePassword(this.form.value.oldPassword, this.form.value.newPassword)
      .subscribe({
        next: () => this.changed.emit(),
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Unable to change password',
            detail: err?.error?.message || 'Something went wrong. Please try again.'
          });
        }
      });
  }
}
