/*
  # Consolidate price analysis policies

  1. Changes
    - Consolidate multiple DELETE policies into a single policy
    - Maintain existing security rules where:
      - Users can delete their own records
      - Super admins can delete any records
    - Optimize policy performance by reducing redundant checks
  
  2. Security
    - Preserve existing access control rules
    - Ensure super admins retain full access
    - Maintain user-level data isolation
*/

-- First, drop the existing overlapping policies
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON public.price_analysis;
DROP POLICY IF EXISTS "Only super admins can clear price analysis data" ON public.price_analysis;
DROP POLICY IF EXISTS "Super admins can bypass RLS" ON public.price_analysis;

-- Create a single consolidated delete policy
CREATE POLICY "Users can delete own records or super admins can delete any"
  ON public.price_analysis
  FOR DELETE 
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'super_admin'
    )
  );

-- Ensure other necessary policies remain
CREATE POLICY "Users can insert with created_by"
  ON public.price_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by IS NULL OR 
    created_by = auth.uid()
  );

CREATE POLICY "Users can read all records"
  ON public.price_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own records"
  ON public.price_analysis
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);