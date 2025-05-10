/*
  # Add SIN column to catalog_items

  1. Changes
    - Add SIN column to catalog_items table
    - Add index for SIN column for faster lookups
*/

-- Add SIN column
ALTER TABLE catalog_items
  ADD COLUMN sin text;

-- Add index for SIN column
CREATE INDEX IF NOT EXISTS idx_catalog_items_sin ON catalog_items(sin);