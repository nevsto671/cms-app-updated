/*
  # Update Catalog Items Schema

  1. Changes
    - Add new columns to catalog_items table:
      - `item_no` (text): Item number identifier
      - `mfr_name` (text): Manufacturer name
      - `mfr_item_no` (text): Manufacturer item number
      - `govt_price` (numeric): Government price with IFF
      - `contract_name` (text): Contract name
      - `contract_no` (text): Contract number
      - `uom` (text): Unit of measure
    - Add indexes for improved query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to catalog_items
ALTER TABLE catalog_items
  ADD COLUMN item_no text,
  ADD COLUMN mfr_name text,
  ADD COLUMN mfr_item_no text,
  ADD COLUMN govt_price numeric,
  ADD COLUMN contract_name text,
  ADD COLUMN contract_no text,
  ADD COLUMN uom text;

-- Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_catalog_items_item_no ON catalog_items(item_no);
CREATE INDEX IF NOT EXISTS idx_catalog_items_mfr_item_no ON catalog_items(mfr_item_no);
CREATE INDEX IF NOT EXISTS idx_catalog_items_contract_no ON catalog_items(contract_no);