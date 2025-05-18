/*
  # Fix Price Analysis Import RLS

  1. Changes
    - Update RLS policies for price_analysis table to ensure created_by is set
    - Add trigger to automatically set created_by on insert

  2. Security
    - Maintains RLS security by ensuring created_by is always set
    - Users can only insert records that will be owned by them
*/

-- Create function to set created_by
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set created_by
DROP TRIGGER IF EXISTS set_created_by_trigger ON price_analysis;
CREATE TRIGGER set_created_by_trigger
  BEFORE INSERT ON price_analysis
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- Update the insert policy to allow inserts without explicitly setting created_by
DROP POLICY IF EXISTS "Users can insert their own price analysis data" ON price_analysis;
CREATE POLICY "Users can insert their own price analysis data"
ON price_analysis
FOR INSERT
TO authenticated
WITH CHECK (true);