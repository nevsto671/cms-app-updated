/*
  # Update tag ID format to remove hyphen

  1. Changes
    - Update tag_id generation to remove hyphen
    - Maintain all existing functionality and constraints
*/

-- Drop existing tag_id column
ALTER TABLE doctag_documents DROP COLUMN tag_id;

-- Add new tag_id column without hyphen
ALTER TABLE doctag_documents 
ADD COLUMN tag_id text GENERATED ALWAYS AS (tag_type || tag_number::text) STORED;

-- Recreate index for tag_id
DROP INDEX IF EXISTS idx_doctag_documents_tag_id;
CREATE INDEX idx_doctag_documents_tag_id ON doctag_documents(tag_id);