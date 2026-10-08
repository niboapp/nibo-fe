import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule, PasswordModule, ButtonModule, DividerModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const verified = this.route.snapshot.queryParamMap.get('verified');
    if (verified === 'true') {
      this.messageService.add({
        severity: 'success',
        summary: 'Email verified',
        detail: 'Your email has been verified. You can now log in.'
      });
    } else if (verified === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Verification failed',
        detail: 'Your verification link is invalid or has expired.'
      });
    }
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle().subscribe(() => {
      this.router.navigate(['/app/overview']);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/app/overview']),
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed',
          detail: err?.error?.message || 'Unable to log in. Please try again.'
        });
      }
    });
  }
}
