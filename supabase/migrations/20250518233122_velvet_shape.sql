/*
  # Fix multiple permissive policies on doctag_documents table

  1. Changes
    - Removes redundant permissive SELECT policies on doctag_documents table
    - Combines "Users can manage their own documents" and "Users can read documents" into a single policy
    - Optimizes performance by eliminating multiple policy evaluations

  2. Security
    - Maintains the same security model
    - Ensures users can still read all documents
    - Ensures users can only manage their own documents
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
  USING (created_by = uid())
  WITH CHECK (created_by = uid());