/// <reference types="google.maps" />
import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, NgZone, OnInit, Output, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appGooglePlacesAutocomplete]'
})
export class GooglePlacesAutocompleteDirective implements OnInit {
  @Output() placeSelected = new EventEmitter<google.maps.places.PlaceResult>();

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      console.error('Google Maps JavaScript API with Places library is not loaded.');
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      this.elementRef.nativeElement,
      {
        types: ['address'],
        componentRestrictions: { country: 'ng' }
      }
    );

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          this.placeSelected.emit(place);
        }
      });
    });
  }
}
