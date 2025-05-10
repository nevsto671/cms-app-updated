/*
  # Create filesystem tables and storage

  1. New Tables
    - `file_nodes` table for file/folder metadata
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `path` (text)
      - `type` (text) - file or folder
      - `size` (bigint)
      - `mime_type` (text)
      - `modified_at` (timestamp)

  2. Storage
    - Create files bucket for storing file contents
    
  3. Security
    - Enable RLS on file_nodes table
    - Add policies for authenticated users
    - Configure storage bucket policies
*/

-- Create file_nodes table
CREATE TABLE IF NOT EXISTS file_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  path text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'folder')),
  size bigint,
  mime_type text,
  modified_at timestamptz DEFAULT now(),
  UNIQUE(user_id, path)
);

-- Enable RLS
ALTER TABLE file_nodes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own files"
  ON file_nodes
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_file_nodes_user_path ON file_nodes(user_id, path);
CREATE INDEX idx_file_nodes_parent_path ON file_nodes(user_id, substring(path from '^(.*/)[^/]*$'));

-- Create storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('files', 'files')
ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can manage their own files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text);