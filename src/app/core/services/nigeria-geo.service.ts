import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { NgLga, NgState } from '../models/nigeria-geo.model';

// The dataset spells it 'FCT - Abuja' while map/other sources use
// 'Federal Capital Territory' — resolve both spellings to the same state.
const STATE_ALIASES: Record<string, string> = {
  'Federal Capital Territory': 'FCT - Abuja'
};

@Injectable({ providedIn: 'root' })
export class NigeriaGeoService {
  private http = inject(HttpClient);

  private readonly states$ = this.http
    .get<{ states: NgState[] }>('/data/nigeria-states-lgas.json')
    .pipe(map(res => res.states), shareReplay(1));

  getStates(): Observable<NgState[]> {
    return this.states$;
  }

  getStateNames(): Observable<string[]> {
    return this.states$.pipe(map(states => states.map(s => s.name)));
  }

  getLgas(stateName: string): Observable<NgLga[]> {
    const wanted = STATE_ALIASES[stateName] ?? stateName;
    return this.states$.pipe(
      map(states => states.find(s => s.name === wanted || s.name === stateName)?.lgas ?? [])
    );
  }

  getLgaNames(stateName: string): Observable<string[]> {
    return this.getLgas(stateName).pipe(map(lgas => lgas.map(l => l.name)));
  }
}
