/*
  # Update DocTag document policies

  1. Changes
    - Remove redundant document read policy
    - Create new comprehensive read policy for all authenticated users
    - Update management policy to use correct auth.uid() function
    
  2. Security
    - Maintains RLS enforcement
    - All authenticated users can read documents
    - Users can only modify their own documents
*/

-- First, drop the redundant policies
DROP POLICY IF EXISTS "Users can read documents" ON public.doctag_documents;

-- Create a new comprehensive policy that combines both access patterns
DROP POLICY IF EXISTS "Users can read and manage documents" ON public.doctag_documents;
CREATE POLICY "Users can read and manage documents"
  ON public.doctag_documents
  FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to read all documents

-- Keep the existing management policy for other operations
-- This ensures users can only modify their own documents
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.doctag_documents;
CREATE POLICY "Users can manage their own documents"
  ON public.doctag_documents
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());