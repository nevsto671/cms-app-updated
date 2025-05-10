/*
  # Create Catalog Database Schema

  1. New Tables
    - `catalog_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `catalog_codes`
      - `id` (uuid, primary key)
      - `catalog_item_id` (uuid, references catalog_items)
      - `code_type` (text) - NAICS, PSC, or SIN
      - `code` (text)
      - `created_at` (timestamp)
    
    - `catalog_tags`
      - `id` (uuid, primary key)
      - `catalog_item_id` (uuid, references catalog_items)
      - `tag` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create catalog_items table
CREATE TABLE catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create catalog_codes table
CREATE TABLE catalog_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id uuid REFERENCES catalog_items(id) ON DELETE CASCADE,
  code_type text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_code_type CHECK (code_type IN ('NAICS', 'PSC', 'SIN'))
);

-- Create catalog_tags table
CREATE TABLE catalog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id uuid REFERENCES catalog_items(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users"
  ON catalog_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to authenticated users"
  ON catalog_codes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to authenticated users"
  ON catalog_tags
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_catalog_items_category ON catalog_items(category);
CREATE INDEX idx_catalog_codes_type_code ON catalog_codes(code_type, code);
CREATE INDEX idx_catalog_tags_tag ON catalog_tags(tag);