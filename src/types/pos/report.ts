export interface ReportItemDetail {
  _id: string;
  sell_id: string;
  customer: string;
  date: string;
  image: string | null;
  code: string;
  product_name: string;
  category: string;
  item_type: string;
  product_size: string;
  metal: string;
  metal_color: string;
  gwt: number;
  nwt: number;
  stone_name: string;
  shape: string;
  size: string;
  s_weight: number;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
  qty: number;
  tax: string;
  price: number;
  discount: string | number;
  deposit?: number;
  amount: number;
}

export interface OrderReportItem {
  _id: string;
  order_no: string;
  order_date: string;
  customer_name: string;
  total_items: number;
  header_amount: number;
  order_type: string;
  items: ReportItemDetail[];
}

export interface ReportPagination {
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface ReportListResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: ReportPagination;
  data: OrderReportItem[];
}
