export interface Retailer {
  id: string;
  name: string;
  location: string;
  phoneNumber: string;
}

// RetailerRecord mirrors the backend retailer document (snake_case JSON attrs).
export interface RetailerRecord {
  _id: string;
  organization_id?: string;
  name: string;
  address?: string;
  phone_number?: string;
  image_url?: string;
  state?: string;
  lga?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RetailersPage {
  items: Retailer[];
  total: number;
  limit: number;
  skip: number;
}