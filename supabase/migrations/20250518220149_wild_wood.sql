/*
  # Update Price Analysis Labels

  1. Changes
     - Adds a function to update the is_proposed_price_lte_mfc column label
     - Updates the trigger to use the new function
     - Adds a comment to the is_proposed_price_lte_mfc column
*/

-- Update the function to calculate if proposed price is less than or equal to MFC price
CREATE OR REPLACE FUNCTION update_is_proposed_price_lte_mfc()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.proposed_price IS NULL OR NEW.mfc_price IS NULL THEN
    NEW.is_proposed_price_lte_mfc := 'NO';
  ELSE
    NEW.is_proposed_price_lte_mfc := CASE WHEN NEW.proposed_price <= NEW.mfc_price THEN 'YES' ELSE 'NO' END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_is_proposed_price_lte_mfc_trigger'
  ) THEN
    CREATE TRIGGER update_is_proposed_price_lte_mfc_trigger
    BEFORE INSERT OR UPDATE OF proposed_price, mfc_price
    ON price_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_is_proposed_price_lte_mfc();
  END IF;
END
$$;

-- Add comment to the is_proposed_price_lte_mfc column
COMMENT ON COLUMN price_analysis.is_proposed_price_lte_mfc IS 'YES = Favorable pricing (proposed price <= MFC price), NO = Unfavorable pricing (proposed price > MFC price)';

-- Update existing records
UPDATE price_analysis
SET is_proposed_price_lte_mfc = CASE WHEN proposed_price <= mfc_price THEN 'YES' ELSE 'NO' END
WHERE proposed_price IS NOT NULL AND mfc_price IS NOT NULL;