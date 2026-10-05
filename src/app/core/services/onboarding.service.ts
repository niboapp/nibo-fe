import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BusinessOnboarding } from '../models/onboarding.model';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  // TODO(backend): GET the real list of selectable categories/industries
  getAvailableCategories(): Observable<string[]> {
    return of([]);
  }

  getIndustries(): Observable<string[]> {
    return of([]);
  }

  submitBusiness(payload: BusinessOnboarding, logo: File | null): Observable<void> {
    // TODO(backend): POST multipart payload to /businesses
    return of(void 0);
  }
}