/*
  # Redesign Document Tagging System

  1. Changes
    - Drop existing doctag_documents table
    - Create new doctag_documents table with updated schema
    - Add constraints and indexes
    - Enable RLS and add policies

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS doctag_documents;

-- Create new doctag_documents table
CREATE TABLE doctag_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_type char(1) NOT NULL CHECK (tag_type IN ('S', 'P', 'C')),
  tag_number integer NOT NULL CHECK (tag_number BETWEEN 1 AND 999),
  tag_id text GENERATED ALWAYS AS (tag_type || '-' || tag_number::text) STORED,
  document_title text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tag_type, tag_number)
);

-- Enable RLS
ALTER TABLE doctag_documents ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_doctag_documents_tag_id ON doctag_documents(tag_id);
CREATE INDEX idx_doctag_documents_status ON doctag_documents(status);
CREATE INDEX idx_doctag_documents_created_by ON doctag_documents(created_by);

-- Create policies
CREATE POLICY "Users can read documents"
  ON doctag_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own documents"
  ON doctag_documents
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Create function to get next available tag number
CREATE OR REPLACE FUNCTION get_next_tag_number(p_tag_type char(1))
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  next_number integer;
BEGIN
  SELECT COALESCE(MAX(tag_number), 0) + 1
  INTO next_number
  FROM doctag_documents
  WHERE tag_type = p_tag_type;
  
  RETURN next_number;
END;
$$;