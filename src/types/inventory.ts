export interface InventoryItem {
  id: string;
  index?: number;
  image?: string;
  code: string;
  productName: string;
  date: string;
  unit: string;
  qty: number;
  cost: number;
  amount: number;
  salePrice: number;
  status: string;
}
