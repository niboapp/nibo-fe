import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BusinessProfile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  // TODO(backend): replace with real HTTP calls
  // getProfile(): Observable<BusinessProfile> { return this.http.get<BusinessProfile>(`${environment.apiUrl}/profile`); }
  // updateProfile(profile: BusinessProfile): Observable<BusinessProfile> { return this.http.put<BusinessProfile>(`${environment.apiUrl}/profile`, profile); }

  getProfile(): Observable<BusinessProfile> {
    return of({
      name: '',
      handle: '',
      avatarInitials: '',
      productsCount: 0,
      retailersCount: 0,
      visits: 0,
      growthPercent: 0,
      location: '',
      industry: '',
      email: '',
      phone: '',
      founded: '',
      where2buyLink: '',
      profileUrl: '',
      productCategories: [],
      profileCompletenessPercent: 0,
      completenessHint: ''
    });
  }

  updateProfile(profile: BusinessProfile): Observable<BusinessProfile> {
    return of(profile);
  }
}