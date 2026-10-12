export interface NgLga {
  id: string;
  name: string;
}

export interface NgState {
  id: string;
  name: string;
  region_name: string;
  lgas: NgLga[];
}
