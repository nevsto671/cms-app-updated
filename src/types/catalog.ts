// Add PriceAnalysis interface
export interface PriceAnalysis {
  id: string;
  sin: string;
  itemNumber: string;
  description: string;
  mfrName: string;
  mfrNumber: string;
  unitsSoldQty: number;
  totalCommAndProposedSales: number;
  totalCommercialSales: number;
  commercialPriceList: number;
  mfcPrice: number;
  mfcDiscount: number;
  tcPrice: number | null;
  tcDiscount: number | null;
  tcTotalSales: number | null;
  proposedPrice: number;
  proposedDiscount: number;
  isProposedPriceLteMfc: 'YES' | 'NO' | null;
  proposedTotalSales: number | null;
  trackingRatio: number;
  createdDate: Date;
  updatedDate: Date;
  uploadBatchId: string | null;
  createdBy: string | null;
}