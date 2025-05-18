export interface PriceAnalysis {
  id: string;
  sin: string;
  item_number: string;
  description: string;
  mfr_name: string;
  mfr_number: string;
  units_sold_qty: number;
  total_comm_and_proposed_sales: number;
  total_commercial_sales: number;
  commercial_price_list: number;
  mfc_price: number;
  mfc_discount: number;
  tc_price: number | null;
  tc_discount: number | null;
  tc_total_sales: number | null;
  proposed_price: number;
  proposed_discount: number;
  proposed_total_sales: number | null;
  is_proposed_price_lte_mfc: 'YES' | 'NO' | null;
  tracking_ratio: number;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  upload_batch_id: string | null;
}

export interface ManufacturerAnalysis {
  name: string;
  totalItems: number;
  totalSales: number;
  averageDiscount: number;
  zeroSalesItems: number;
}

export interface DiscountAnalysis {
  mfcDiscount: number;
  tcDiscount: number;
  proposedDiscount: number;
  isProposedLowerThanMfc: boolean;
}