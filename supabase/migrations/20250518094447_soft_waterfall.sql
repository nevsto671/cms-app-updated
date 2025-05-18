/*
  # Fix Price Analysis RLS Policies

  1. Changes
    - Drop existing policies and recreate them with proper permissions
    - Add trigger to automatically set created_by
    - Enable RLS on the table
    - Add proper policies for CRUD operations

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Set up created_by tracking
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON price_analysis;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON price_analysis;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON price_analysis;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON price_analysis;

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

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS set_created_by_trigger ON price_analysis;

CREATE TRIGGER set_created_by_trigger
  BEFORE INSERT ON price_analysis
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();