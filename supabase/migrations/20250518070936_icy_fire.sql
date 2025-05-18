/*
  # Add Price Analysis Table
  
  1. New Tables
    - `price_analysis`
      - `id` (uuid, primary key)
      - `sin` (text)
      - `item_number` (text)
      - `description` (text)
      - `mfr_name` (text)
      - `mfr_number` (text)
      - `units_sold_qty` (integer)
      - `total_comm_and_proposed_sales` (numeric)
      - `total_commercial_sales` (numeric)
      - `commercial_price_list` (numeric)
      - `mfc_price` (numeric)
      - `mfc_discount` (numeric)
      - `tc_price` (numeric)
      - `tc_discount` (numeric)
      - `tc_total_sales` (numeric)
      - `proposed_price` (numeric)
      - `proposed_discount` (numeric)
      - `is_proposed_price_lte_mfc` (text)
      - `proposed_total_sales` (numeric)
      - `tracking_ratio` (numeric)
      - `upload_batch_id` (text)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS price_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sin text NOT NULL,
  item_number text NOT NULL,
  description text,
  mfr_name text NOT NULL,
  mfr_number text NOT NULL,
  units_sold_qty integer NOT NULL DEFAULT 0,
  total_comm_and_proposed_sales numeric(15,2),
  total_commercial_sales numeric(15,2),
  commercial_price_list numeric(15,2),
  mfc_price numeric(15,2),
  mfc_discount numeric(5,2),
  tc_price numeric(15,2),
  tc_discount numeric(5,2),
  tc_total_sales numeric(15,2),
  proposed_price numeric(15,2),
  proposed_discount numeric(5,2),
  is_proposed_price_lte_mfc text CHECK (is_proposed_price_lte_mfc IN ('YES', 'NO')),
  proposed_total_sales numeric(15,2),
  tracking_ratio numeric(10,2),
  upload_batch_id text,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE price_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all price analysis data"
  ON price_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own price analysis data"
  ON price_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own price analysis data"
  ON price_analysis
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own price analysis data"
  ON price_analysis
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create indexes for better query performance
CREATE INDEX idx_price_analysis_sin ON price_analysis(sin);
CREATE INDEX idx_price_analysis_item_number ON price_analysis(item_number);
CREATE INDEX idx_price_analysis_mfr_number ON price_analysis(mfr_number);
CREATE INDEX idx_price_analysis_batch ON price_analysis(upload_batch_id);
CREATE INDEX idx_price_analysis_created_by ON price_analysis(created_by);