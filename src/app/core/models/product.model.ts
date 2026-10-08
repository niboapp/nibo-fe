export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  retailPrice: number;
  quantity: number;
  batchNumber: string;
  barcode?: string;
  category?: string;
  manufacturingDate?: string;
  expiringDate?: string;
  dateAdded?: string;
}

// ProductRecord mirrors the backend product document (snake_case JSON attrs).
export interface ProductRecord {
  _id: string;
  organization_id?: string;
  name: string;
  description?: string;
  image_url?: string;
  retail_price?: number;
  quantity?: number;
  barcode?: string;
  batch_number?: string;
  category?: string;
  manufacturing_date?: string;
  expiring_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsPage {
  items: Product[];
  total: number;
  limit: number;
  skip: number;
}
