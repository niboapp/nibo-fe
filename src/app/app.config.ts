import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

const NiboPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#FEF3FB',
      100: '#FDE0F6',
      200: '#FBC2ED',
      300: '#F999E0',
      400: '#F76ED1',
      500: '#F606BA',
      600: '#D8009E',
      700: '#B3007A',
      800: '#8C0060',
      900: '#660047',
      950: '#45002F'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: NiboPreset,
        options: { darkModeSelector: false }
      }
    }),
    ConfirmationService
  ]
};
