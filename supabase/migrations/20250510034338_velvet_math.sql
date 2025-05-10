/*
  # Fix tag type policies

  1. Changes
    - Drop existing policies before recreating them
    - Add unique names for policies to avoid conflicts
    - Maintain same functionality with renamed policies

  2. Security
    - Maintains RLS protection
    - Preserves access control
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
CREATE INDEX IF NOT EXISTS idx_tag_types_code ON tag_types(code);
CREATE INDEX IF NOT EXISTS idx_tag_items_tag_id ON tag_items(tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_items_status ON tag_items(status);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON tag_types;
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON tag_items;

-- Create policies with unique names
CREATE POLICY "tag_types_read_policy"
  ON tag_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "tag_items_read_policy"
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