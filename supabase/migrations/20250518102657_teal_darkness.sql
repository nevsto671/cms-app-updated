/*
  # Add SIN Dashboard Fields

  1. New Fields
    - Add fields for tracking ratios and discount calculations
    - Add fields for sales analysis
    - Add fields for manufacturer analysis
  
  2. Changes
    - Add constraints for discount percentages
    - Add indexes for performance optimization
*/

-- Add new fields and constraints
ALTER TABLE price_analysis
  ADD COLUMN IF NOT EXISTS tracking_ratio numeric(10,2),
  ADD COLUMN IF NOT EXISTS is_proposed_price_lte_mfc text CHECK (is_proposed_price_lte_mfc IN ('YES', 'NO')),
  ADD COLUMN IF NOT EXISTS tc_price numeric(15,2),
  ADD COLUMN IF NOT EXISTS tc_discount numeric(5,2),
  ADD COLUMN IF NOT EXISTS tc_total_sales numeric(15,2),
  ADD COLUMN IF NOT EXISTS proposed_total_sales numeric(15,2);

-- Add constraints for discount percentages
ALTER TABLE price_analysis
  ADD CONSTRAINT valid_mfc_discount CHECK (mfc_discount BETWEEN -200 AND 100),
  ADD CONSTRAINT valid_tc_discount CHECK (tc_discount BETWEEN -200 AND 100),
  ADD CONSTRAINT valid_proposed_discount CHECK (proposed_discount BETWEEN -200 AND 100);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_price_analysis_mfr_name ON price_analysis (mfr_name);
CREATE INDEX IF NOT EXISTS idx_price_analysis_tracking_ratio ON price_analysis (tracking_ratio);
CREATE INDEX IF NOT EXISTS idx_price_analysis_proposed_price_lte_mfc ON price_analysis (is_proposed_price_lte_mfc);