import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO(backend): POST credentials to the auth endpoint, persist tokens/session
  login(credentials: { email: string; password: string }): Observable<void> {
    return of(void 0);
  }

  // TODO(backend): start the Google OAuth flow (redirect to provider / popup)
  loginWithGoogle(): Observable<void> {
    return of(void 0);
  }

  // TODO(backend): POST registration payload to the auth endpoint
  signUp(payload: { name: string; email: string; password: string }): Observable<void> {
    return of(void 0);
  }

  // TODO(backend): POST email to trigger OTP/password-reset email
  requestPasswordReset(email: string): Observable<void> {
    return of(void 0);
  }

  // TODO(backend): POST {email, otp} to verify the reset code
  verifyOtp(email: string, otp: string): Observable<void> {
    return of(void 0);
  }
}
