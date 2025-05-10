/*
  # Add AI enhancements to catalog system

  1. New Tables
    - `catalog_embeddings`
      - `id` (uuid, primary key)
      - `catalog_item_id` (uuid, references catalog_items)
      - `embedding` (vector(1536))
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `catalog_ai_content`
      - `id` (uuid, primary key)
      - `catalog_item_id` (uuid, references catalog_items)
      - `content_type` (text)
      - `content` (text)
      - `model_version` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add AI-related columns to catalog_items
    - Enable vector extension
    - Add vector similarity search function

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Add AI-related columns to catalog_items
ALTER TABLE catalog_items 
  ADD COLUMN ai_enhanced boolean DEFAULT false,
  ADD COLUMN ai_last_processed timestamptz;

-- Create catalog_embeddings table
CREATE TABLE catalog_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id uuid REFERENCES catalog_items(id) ON DELETE CASCADE,
  embedding vector(1536), -- Using 1536 dimensions for OpenAI embeddings
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create catalog_ai_content table
CREATE TABLE catalog_ai_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id uuid REFERENCES catalog_items(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('description', 'summary', 'features', 'specifications')),
  content text NOT NULL,
  model_version text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE catalog_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_ai_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users"
  ON catalog_embeddings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to authenticated users"
  ON catalog_ai_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_catalog_embeddings_item_id ON catalog_embeddings(catalog_item_id);
CREATE INDEX idx_catalog_ai_content_item_id ON catalog_ai_content(catalog_item_id);
CREATE INDEX idx_catalog_ai_content_type ON catalog_ai_content(content_type);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION search_similar_items(
  query_embedding vector(1536),
  similarity_threshold float,
  max_results integer
)
RETURNS TABLE (
  catalog_item_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.catalog_item_id,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM catalog_embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT max_results;
END;
$$;