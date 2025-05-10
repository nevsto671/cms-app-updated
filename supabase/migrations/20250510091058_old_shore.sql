/*
  # Add Document Types Table

  1. New Tables
    - `file_cabinet_document_types` table for storing document type definitions
      - `id` (uuid, primary key)
      - `folder_id` (uuid, references file_cabinet_folders)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create document types table
CREATE TABLE file_cabinet_document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES file_cabinet_folders(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE file_cabinet_document_types ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_document_types_folder ON file_cabinet_document_types(folder_id);
CREATE INDEX idx_document_types_status ON file_cabinet_document_types(status);

-- Create policies
CREATE POLICY "Users can manage document types in their folders"
  ON file_cabinet_document_types
  FOR ALL
  TO authenticated
  USING (
    folder_id IN (
      SELECT id FROM file_cabinet_folders 
      WHERE created_by = auth.uid()
    )
  )
  WITH CHECK (
    folder_id IN (
      SELECT id FROM file_cabinet_folders 
      WHERE created_by = auth.uid()
    )
  );