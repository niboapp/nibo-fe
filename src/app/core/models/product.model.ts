export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  retailPrice: number;
  quantity: number;
  batchNumber: string;
  category?: string;
  dateAdded?: string;
}