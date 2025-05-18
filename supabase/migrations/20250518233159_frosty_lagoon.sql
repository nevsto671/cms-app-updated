/*
  # Fix multiple permissive policies on doctag_documents table

  1. Changes
    - Remove redundant SELECT policies
    - Create single comprehensive policy for document access
    - Fix auth.uid() function usage
    
  2. Security
    - Maintains existing security model
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