import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, InputTextModule, InputOtpModule, ButtonModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  step: 'email' | 'otp' = 'email';
  emailForm: FormGroup;
  otp = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email(): string {
    return this.emailForm.get('email')?.value ?? '';
  }

  get emailInvalid(): boolean {
    const control = this.emailForm.get('email');
    return !!(control && control.invalid && control.touched);
  }

  sendCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.authService.requestPasswordReset(this.email).subscribe(() => {
      this.step = 'otp';
    });
  }

  resendCode(): void {
    this.authService.requestPasswordReset(this.email).subscribe();
  }

  verifyCode(): void {
    if (this.otp.length !== 5) return;
    this.authService.verifyOtp(this.email, this.otp).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Password reset',
        detail: 'Your password has been reset. Please log in.'
      });
      this.router.navigate(['/login']);
    });
  }
}
