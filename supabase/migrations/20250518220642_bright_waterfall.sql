/*
  # Update Price Analysis Column Labels and Triggers

  1. Updates
    - Add comment to is_proposed_price_lte_mfc column to clarify meaning
    - Update trigger function for is_proposed_price_lte_mfc calculation
    - Add trigger for tracking ratio calculation
  
  2. Security
    - Add policy for super admins to manage price analysis data
*/

-- Update the comment on the is_proposed_price_lte_mfc column
COMMENT ON COLUMN price_analysis.is_proposed_price_lte_mfc IS 'YES = Favorable pricing (proposed price <= MFC price), NO = Unfavorable pricing (proposed price > MFC price)';

-- Create or replace the function to calculate if proposed price is less than or equal to MFC price
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

-- Create or replace the function to calculate tracking ratio
CREATE OR REPLACE FUNCTION update_tracking_ratio()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.proposed_price IS NULL OR NEW.tc_price IS NULL OR NEW.tc_price = 0 THEN
    NEW.tracking_ratio := NULL;
  ELSE
    NEW.tracking_ratio := ROUND((NEW.proposed_price / NEW.tc_price)::numeric, 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the function to calculate total commercial sales
CREATE OR REPLACE FUNCTION update_total_commercial_sales()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_comm_and_proposed_sales IS NULL OR NEW.proposed_total_sales IS NULL THEN
    NEW.total_commercial_sales := NULL;
  ELSE
    NEW.total_commercial_sales := NEW.total_comm_and_proposed_sales - NEW.proposed_total_sales;
    
    -- Ensure total_commercial_sales is not negative
    IF NEW.total_commercial_sales < 0 THEN
      NEW.total_commercial_sales := 0;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the function to calculate discount percentages
CREATE OR REPLACE FUNCTION update_discount_percentages()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate MFC discount
  IF NEW.commercial_price_list IS NOT NULL AND NEW.commercial_price_list > 0 AND NEW.mfc_price IS NOT NULL THEN
    NEW.mfc_discount := ROUND(((NEW.commercial_price_list - NEW.mfc_price) / NEW.commercial_price_list * 100)::numeric, 2);
  END IF;
  
  -- Calculate TC discount
  IF NEW.commercial_price_list IS NOT NULL AND NEW.commercial_price_list > 0 AND NEW.tc_price IS NOT NULL THEN
    NEW.tc_discount := ROUND(((NEW.commercial_price_list - NEW.tc_price) / NEW.commercial_price_list * 100)::numeric, 2);
  END IF;
  
  -- Calculate proposed discount
  IF NEW.commercial_price_list IS NOT NULL AND NEW.commercial_price_list > 0 AND NEW.proposed_price IS NOT NULL THEN
    NEW.proposed_discount := ROUND(((NEW.commercial_price_list - NEW.proposed_price) / NEW.commercial_price_list * 100)::numeric, 2);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DO $$
BEGIN
  -- is_proposed_price_lte_mfc trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_is_proposed_price_lte_mfc_trigger') THEN
    CREATE TRIGGER update_is_proposed_price_lte_mfc_trigger
    BEFORE INSERT OR UPDATE OF proposed_price, mfc_price
    ON price_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_is_proposed_price_lte_mfc();
  END IF;
  
  -- tracking_ratio trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tracking_ratio_trigger') THEN
    CREATE TRIGGER update_tracking_ratio_trigger
    BEFORE INSERT OR UPDATE OF proposed_price, tc_price
    ON price_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_tracking_ratio();
  END IF;
  
  -- total_commercial_sales trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_total_commercial_sales_trigger') THEN
    CREATE TRIGGER update_total_commercial_sales_trigger
    BEFORE INSERT OR UPDATE OF total_comm_and_proposed_sales, proposed_total_sales
    ON price_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_total_commercial_sales();
  END IF;
  
  -- discount percentages trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_discount_percentages_trigger') THEN
    CREATE TRIGGER update_discount_percentages_trigger
    BEFORE INSERT OR UPDATE OF commercial_price_list, mfc_price, tc_price, proposed_price
    ON price_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_discount_percentages();
  END IF;
END
$$;

-- Update existing records
UPDATE price_analysis
SET 
  is_proposed_price_lte_mfc = CASE WHEN proposed_price <= mfc_price THEN 'YES' ELSE 'NO' END
WHERE 
  proposed_price IS NOT NULL AND mfc_price IS NOT NULL;

-- Add policy for super admins to bypass RLS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'price_analysis' AND policyname = 'Super admins can bypass RLS'
  ) THEN
    CREATE POLICY "Super admins can bypass RLS" 
    ON price_analysis 
    AS PERMISSIVE 
    FOR ALL 
    TO authenticated 
    USING (
      EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'super_admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'super_admin'
      )
    );
  END IF;
END
$$;