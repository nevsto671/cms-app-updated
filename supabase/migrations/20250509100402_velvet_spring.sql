/*
  # Add catalog items RLS policies

  1. Changes
    - Add INSERT policy for authenticated users to add catalog items
    - Add UPDATE policy for authenticated users to modify catalog items
    - Add DELETE policy for authenticated users to remove catalog items

  2. Security
    - Maintains existing SELECT policy
    - Adds policies for INSERT, UPDATE, and DELETE operations
    - All operations require authentication
*/

-- Add INSERT policy
CREATE POLICY "Authenticated users can insert catalog items"
ON catalog_items
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add UPDATE policy
CREATE POLICY "Authenticated users can update catalog items"
ON catalog_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Add DELETE policy
CREATE POLICY "Authenticated users can delete catalog items"
ON catalog_items
FOR DELETE
TO authenticated
USING (true);