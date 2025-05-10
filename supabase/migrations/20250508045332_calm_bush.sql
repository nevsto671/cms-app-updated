/*
  # Create workflow management tables

  1. New Tables
    - `offices`
      - `id` (uuid, primary key)
      - `name` (text)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `proposals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `naics_code` (text)
      - `value` (numeric)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `assigned_office_id` (uuid, foreign key)
      - `queued_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `routing_rules`
      - `id` (uuid, primary key)
      - `naics_code` (text)
      - `office_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create offices table
CREATE TABLE IF NOT EXISTS offices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  naics_code text NOT NULL,
  value numeric,
  description text,
  status text NOT NULL CHECK (status IN ('pending', 'assigned', 'queued')),
  priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  assigned_office_id uuid REFERENCES offices(id) ON DELETE SET NULL,
  queued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create routing rules table
CREATE TABLE IF NOT EXISTS routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naics_code text NOT NULL,
  office_id uuid NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(naics_code, office_id)
);

-- Enable Row Level Security
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE routing_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for offices
CREATE POLICY "Authenticated users can read offices"
  ON offices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert offices"
  ON offices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for proposals
CREATE POLICY "Authenticated users can read proposals"
  ON proposals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update proposals"
  ON proposals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for routing rules
CREATE POLICY "Authenticated users can read routing rules"
  ON routing_rules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage routing rules"
  ON routing_rules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_priority ON proposals(priority);
CREATE INDEX IF NOT EXISTS idx_proposals_naics_code ON proposals(naics_code);
CREATE INDEX IF NOT EXISTS idx_routing_rules_naics_code ON routing_rules(naics_code);