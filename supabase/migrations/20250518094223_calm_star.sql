/*
  # Fix Price Analysis RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new policies for all operations
    - Add trigger for setting created_by automatically

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Ensure created_by is set automatically
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can delete their own price analysis data" ON price_analysis;
DROP POLICY IF EXISTS "Users can insert their own price analysis data" ON price_analysis;
DROP POLICY IF EXISTS "Users can read all price analysis data" ON price_analysis;
DROP POLICY IF EXISTS "Users can update their own price analysis data" ON price_analysis;

-- Enable RLS
ALTER TABLE price_analysis ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON price_analysis FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON price_analysis FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for users based on created_by"
ON price_analysis FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on created_by"
ON price_analysis FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Create trigger to set created_by
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_created_by_trigger ON price_analysis;

CREATE TRIGGER set_created_by_trigger
  BEFORE INSERT ON price_analysis
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();