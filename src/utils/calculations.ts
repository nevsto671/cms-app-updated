/**
 * Utility functions for SIN Dashboard calculations
 */

/**
 * Calculate discount percentage
 * This calculates the discount as a percentage off the commercial price list
 */
export function calculateDiscountPercentage(commercialPriceList: number, comparisonPrice: number): number {
  if (commercialPriceList === 0) return 0;
  
  const discountAmount = commercialPriceList - comparisonPrice;
  const discountPercentage = (discountAmount / commercialPriceList) * 100;
  
  return Number(discountPercentage.toFixed(2));
}

/**
 * Calculate total commercial sales
 */
export function calculateTotalCommercialSales(totalCommAndProposedSales: number, proposedTotalSales: number): number {
  return totalCommAndProposedSales - proposedTotalSales;
}

/**
 * Calculate tracking ratio
 */
export function calculateTrackingRatio(proposedPrice: number, tcPrice: number): number {
  if (tcPrice === 0) return 0;
  return Number((proposedPrice / tcPrice).toFixed(2));
}

/**
 * Format currency value
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(2)}%`;
}

/**
 * Check if proposed price is less than or equal to MFC price
 */
export function isProposedPriceLteMfc(proposedPrice: number, mfcPrice: number): 'YES' | 'NO' {
  return proposedPrice <= mfcPrice ? 'YES' : 'NO';
}