/*
  # Update tracking ratio calculation

  1. Changes
    - Update tracking ratio calculation to be proposed_price / tc_price
    - Add function to calculate tracking ratio
    - Add trigger to automatically update tracking ratio
*/

-- Create function to calculate tracking ratio
CREATE OR REPLACE FUNCTION calculate_tracking_ratio(proposed_price numeric, tc_price numeric)
RETURNS numeric AS $$
BEGIN
  IF tc_price IS NULL OR tc_price = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((proposed_price / tc_price)::numeric, 2);
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update tracking ratio
CREATE OR REPLACE FUNCTION update_tracking_ratio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_ratio := calculate_tracking_ratio(NEW.proposed_price, NEW.tc_price);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_tracking_ratio_trigger ON price_analysis;
CREATE TRIGGER update_tracking_ratio_trigger
  BEFORE INSERT OR UPDATE OF proposed_price, tc_price
  ON price_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_tracking_ratio();

-- Update existing records
UPDATE price_analysis
SET tracking_ratio = calculate_tracking_ratio(proposed_price, tc_price);