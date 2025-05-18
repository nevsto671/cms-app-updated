/*
  # Update price analysis RLS policies

  1. Changes
    - Modify insert policy to properly handle imports
    - Ensure created_by is set correctly for new rows
    - Maintain existing policies for other operations

  2. Security
    - Keep RLS enabled
    - Maintain super admin bypass
    - Ensure users can only manage their own data
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON price_analysis;

-- Create new insert policy that sets created_by to the current user
CREATE POLICY "Enable insert access for authenticated users"
ON price_analysis
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insert if created_by is null (will be set by trigger)
  -- or if it matches the current user
  (created_by IS NULL) OR (created_by = auth.uid())
);