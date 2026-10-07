import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Retailer } from '../models/retailer.model';
import { RetailerChainResult } from '../models/retailer-chain-result.model';

// TODO(backend): replace with data from the retailers endpoint
const MOCK_RETAILERS: Retailer[] = [
  { id: 'r01', name: 'BOLUKI PHARMACY', location: '15, IKU ROAD, PEN CINEMA, AGEGE, LAGOS', phoneNumber: '07071223479' },
  { id: 'r02', name: 'MEDPLUS PHARMACY', location: '12, ALLEN AVENUE, IKEJA, LAGOS', phoneNumber: '08024561782' },
  { id: 'r03', name: 'HEALTHPLUS PHARMACY', location: '4, ADEOLA ODEKU STREET, VICTORIA ISLAND, LAGOS', phoneNumber: '08103345521' },
  { id: 'r04', name: 'JENDOL SUPERMARKET', location: '9, ISHERI ROAD, OGBA, LAGOS', phoneNumber: '07012233098' },
  { id: 'r05', name: 'EKO PHARMACY', location: '23, BROAD STREET, LAGOS ISLAND, LAGOS', phoneNumber: '09034521107' },
  { id: 'r06', name: 'ALPHA PHARMACY', location: '31, MURI OKUNOLA STREET, VICTORIA ISLAND, LAGOS', phoneNumber: '08092211453' },
  { id: 'r07', name: 'GOODLIFE PHARMACY', location: '7, OPEBI ROAD, IKEJA, LAGOS', phoneNumber: '07053381926' },
  { id: 'r08', name: 'FOREMOST PHARMACY', location: '18, ADENIYI JONES AVENUE, IKEJA, LAGOS', phoneNumber: '08122098314' },
  { id: 'r09', name: 'MABIFUS CHEMIST', location: '6, ENUGU STREET, SABO, YABA, LAGOS', phoneNumber: '08034421765' },
  { id: 'r10', name: 'H-MEDIX PHARMACY', location: '44, ADEOLA HOPEWELL STREET, VICTORIA ISLAND, LAGOS', phoneNumber: '09081145237' },
  { id: 'r11', name: 'EMZOR PHARMACY', location: '28, FATAI ATERE WAY, MATORI, LAGOS', phoneNumber: '07016543287' },
  { id: 'r12', name: 'ANGELS PHARMACY', location: '11, TOYIN STREET, IKEJA, LAGOS', phoneNumber: '08147720918' },
  { id: 'r13', name: 'CEDAR CREST PHARMACY', location: '5, APAPA OSHODI EXPRESSWAY, APAPA, LAGOS', phoneNumber: '08029984516' },
  { id: 'r14', name: 'GREENLIFE PHARMACY', location: '17, HERBERT MACAULAY WAY, YABA, LAGOS', phoneNumber: '08163377042' },
  { id: 'r15', name: 'TOMMY PHARMACY', location: '39, BODE THOMAS STREET, SURULERE, LAGOS', phoneNumber: '09054482913' },
  { id: 'r16', name: 'PHARMA-DEKO STORE', location: '22, OSHODI APAPA EXPRESSWAY, OSHODI, LAGOS', phoneNumber: '07028866451' },
  { id: 'r17', name: 'ROSELILY PHARMACY', location: '8, AWOLOWO ROAD, IKOYI, LAGOS', phoneNumber: '08071553928' },
  { id: 'r18', name: 'DOMINO PHARMACY', location: '36, OGUNLANA DRIVE, SURULERE, LAGOS', phoneNumber: '08194022376' },
  { id: 'r19', name: 'MELVIN PHARMACY', location: '14, ST FINBARRS ROAD, AKOKA, LAGOS', phoneNumber: '09037718465' },
  { id: 'r20', name: 'BOND CHEMIST', location: '2, IDOWU TAYLOR STREET, VICTORIA ISLAND, LAGOS', phoneNumber: '07082551938' },
  { id: 'r21', name: 'CRUSADER PHARMACY', location: '27, MARINA ROAD, LAGOS ISLAND, LAGOS', phoneNumber: '08056143729' },
  { id: 'r22', name: 'MISSION PHARMACY', location: '50, AGEGE MOTOR ROAD, MUSHIN, LAGOS', phoneNumber: '08139244780' },
];

@Injectable({ providedIn: 'root' })
export class RetailersService {
  // TODO(backend): swap this for a real HTTP call, e.g.
  // constructor(private http: HttpClient) {}
  // getRetailers(): Observable<Retailer[]> {
  //   return this.http.get<Retailer[]>(`${environment.apiUrl}/retailers`);
  // }
  getRetailers(): Observable<Retailer[]> {
    return of(MOCK_RETAILERS);
  }

  saveRetailers(rows: { name: string; location: string; phoneNumber: string }[]): Observable<void> {
    // TODO(backend): POST rows to the retailers endpoint
    return of(void 0);
  }

  getRetailer(id: string): Observable<Retailer> {
    // TODO(backend): GET /retailers/:id
    const retailer = MOCK_RETAILERS.find(r => r.id === id)
      ?? { id, name: '', location: '', phoneNumber: '' };
    return of({ ...retailer });
  }

  updateRetailer(id: string, changes: Partial<Retailer>): Observable<void> {
    // TODO(backend): PUT /retailers/:id
    return of(void 0);
  }

  searchRetailerChains(term: string, state: string): Observable<RetailerChainResult[]> {
    // TODO(backend): GET /retailers/chains?query=term&state=state
    return of([]);
  }

  deleteRetailer(id: string): Observable<void> {
    // TODO(backend): DELETE /retailers/:id
    return of(void 0);
  }
}
