/*
  # Update catalog_codes RLS policies

  1. Changes
    - Drop existing RLS policies for catalog_codes table
    - Add new comprehensive RLS policies for catalog_codes table
      - Allow authenticated users to read all catalog codes
      - Allow authenticated users to insert catalog codes
      - Allow authenticated users to update catalog codes
      - Allow authenticated users to delete catalog codes

  2. Security
    - Maintains RLS enabled on catalog_codes table
    - Adds proper policies for all CRUD operations
    - Ensures authenticated users can access catalog codes data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON catalog_codes;

-- Create new policies
CREATE POLICY "Allow read access to authenticated users"
ON catalog_codes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to authenticated users"
ON catalog_codes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users"
ON catalog_codes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to authenticated users"
ON catalog_codes
FOR DELETE
TO authenticated
USING (true);