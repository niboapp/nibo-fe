import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputOtpModule } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  return password && confirm && password.value !== confirm.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, InputTextModule, InputOtpModule, PasswordModule, ButtonModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  step: 'email' | 'otp' | 'password' = 'email';
  emailForm: FormGroup;
  passwordForm: FormGroup;
  otp = '';
  resetKey = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get email(): string {
    return this.emailForm.get('email')?.value ?? '';
  }

  get emailInvalid(): boolean {
    const control = this.emailForm.get('email');
    return !!(control && control.invalid && control.touched);
  }

  get passwordMismatch(): boolean {
    return !!(this.passwordForm.hasError('passwordMismatch') && this.passwordForm.get('confirmPassword')?.touched);
  }

  isInvalid(field: string): boolean {
    const control = this.passwordForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  sendCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.step = 'otp';
      },
      error: (err) => {
        this.loading = false;
        this.showError(err, 'Unable to send code');
      }
    });
  }

  resendCode(): void {
    this.authService.requestPasswordReset(this.email).subscribe({
      error: (err) => this.showError(err, 'Unable to resend code')
    });
  }

  verifyCode(): void {
    if (this.otp.length !== 5) return;
    this.loading = true;
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (resetKey) => {
        this.loading = false;
        this.resetKey = resetKey;
        this.step = 'password';
      },
      error: (err) => {
        this.loading = false;
        this.showError(err, 'Invalid code');
      }
    });
  }

  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.resetPassword(this.resetKey, this.passwordForm.get('password')?.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Password reset',
          detail: 'Your password has been reset. Please log in.'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.showError(err, 'Unable to reset password');
      }
    });
  }

  private showError(err: unknown, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      summary: fallback,
      detail: (err as { error?: { message?: string } })?.error?.message || 'Something went wrong. Please try again.'
    });
  }
}
