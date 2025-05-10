/*
  # Add Classification Codes Schema

  1. New Tables
    - `naics_codes`
      - `id` (uuid, primary key)
      - `code` (text)
      - `title` (text)
      - `description` (text)
      - `level` (integer)
      - `parent_code` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `psc_codes`
      - `id` (uuid, primary key)
      - `code` (text)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `code_relationships`
      - `id` (uuid, primary key)
      - `source_type` (text)
      - `source_code` (text)
      - `target_type` (text)
      - `target_code` (text)
      - `relationship_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create NAICS codes table
CREATE TABLE IF NOT EXISTS naics_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  level integer NOT NULL,
  parent_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create PSC codes table
CREATE TABLE IF NOT EXISTS psc_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('Product', 'Service', 'Research & Development')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create code relationships table
CREATE TABLE IF NOT EXISTS code_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('NAICS', 'PSC', 'SIN')),
  source_code text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('NAICS', 'PSC', 'SIN')),
  target_code text NOT NULL,
  relationship_type text NOT NULL CHECK (relationship_type IN ('equivalent', 'related', 'parent', 'child')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(source_type, source_code, target_type, target_code)
);

-- Enable RLS
ALTER TABLE naics_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE psc_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_relationships ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_naics_codes_code ON naics_codes(code);
CREATE INDEX idx_naics_codes_parent ON naics_codes(parent_code);
CREATE INDEX idx_psc_codes_code ON psc_codes(code);
CREATE INDEX idx_code_relationships_source ON code_relationships(source_type, source_code);
CREATE INDEX idx_code_relationships_target ON code_relationships(target_type, target_code);

-- Create policies for NAICS codes
CREATE POLICY "Allow read access to authenticated users"
ON naics_codes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to authenticated users"
ON naics_codes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users"
ON naics_codes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to authenticated users"
ON naics_codes
FOR DELETE
TO authenticated
USING (true);

-- Create policies for PSC codes
CREATE POLICY "Allow read access to authenticated users"
ON psc_codes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to authenticated users"
ON psc_codes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users"
ON psc_codes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to authenticated users"
ON psc_codes
FOR DELETE
TO authenticated
USING (true);

-- Create policies for code relationships
CREATE POLICY "Allow read access to authenticated users"
ON code_relationships
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to authenticated users"
ON code_relationships
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users"
ON code_relationships
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to authenticated users"
ON code_relationships
FOR DELETE
TO authenticated
USING (true);