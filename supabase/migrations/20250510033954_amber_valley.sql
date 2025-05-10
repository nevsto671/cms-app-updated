/*
  # Add tag reference data tables

  1. New Tables
    - `tag_types` table for storing tag type definitions
      - `code` (text)
      - `document_type` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tag_items` table for storing predefined tag items
      - `tag_id` (text)
      - `document_title` (text)
      - `created_at` (timestamp)
      - `last_used` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tag types table
CREATE TABLE IF NOT EXISTS tag_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  document_type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tag items table
CREATE TABLE IF NOT EXISTS tag_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text NOT NULL UNIQUE,
  document_title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz,
  status text DEFAULT 'active',
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Enable RLS
ALTER TABLE tag_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_items ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_tag_types_code ON tag_types(code);
CREATE INDEX idx_tag_items_tag_id ON tag_items(tag_id);
CREATE INDEX idx_tag_items_status ON tag_items(status);

-- Create policies
CREATE POLICY "Allow read access to authenticated users"
  ON tag_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to authenticated users"
  ON tag_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial tag types
INSERT INTO tag_types (code, document_type, description) VALUES
  ('S', 'Solicitation', 'Documents related to requesting bids/proposals'),
  ('P', 'Procurement', 'Documents related to purchasing and acquisition'),
  ('C', 'Contract', 'Documents related to formal agreements')
ON CONFLICT (code) DO NOTHING;