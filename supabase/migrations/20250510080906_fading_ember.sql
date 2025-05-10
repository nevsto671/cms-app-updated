/*
  # Optimize tagging configuration database

  1. Changes
    - Add composite index for faster tag lookups
    - Add partial indexes for active documents
    - Add trigger for automatic updated_at timestamp
    - Add function to validate tag sequence
    - Add constraint to prevent duplicate tag sequences
    - Add materialized view for tag statistics
*/

-- Create composite index for faster tag lookups
CREATE INDEX IF NOT EXISTS idx_doctag_documents_type_number 
ON doctag_documents(tag_type, tag_number);

-- Create partial index for active documents
CREATE INDEX IF NOT EXISTS idx_doctag_documents_active 
ON doctag_documents(created_at) 
WHERE status = 'active';

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_doctag_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_doctag_timestamp
  BEFORE UPDATE ON doctag_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_doctag_updated_at();

-- Create function to validate tag sequence
CREATE OR REPLACE FUNCTION validate_tag_sequence()
RETURNS trigger AS $$
BEGIN
  -- Check if tag_number is sequential within tag_type
  IF NEW.tag_number != (
    SELECT COALESCE(MAX(tag_number), 0) + 1
    FROM doctag_documents
    WHERE tag_type = NEW.tag_type
  ) THEN
    RAISE EXCEPTION 'Tag number must be sequential within tag type';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tag sequence validation
CREATE TRIGGER enforce_tag_sequence
  BEFORE INSERT ON doctag_documents
  FOR EACH ROW
  EXECUTE FUNCTION validate_tag_sequence();

-- Create materialized view for tag statistics
CREATE MATERIALIZED VIEW doctag_statistics AS
SELECT 
  tag_type,
  COUNT(*) as total_tags,
  COUNT(*) FILTER (WHERE status = 'active') as active_tags,
  COUNT(*) FILTER (WHERE status = 'inactive') as inactive_tags,
  MAX(tag_number) as last_tag_number,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM doctag_documents
GROUP BY tag_type;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_doctag_statistics_type 
ON doctag_statistics(tag_type);

-- Create function to refresh statistics
CREATE OR REPLACE FUNCTION refresh_doctag_statistics()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY doctag_statistics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh statistics
CREATE TRIGGER refresh_doctag_stats
  AFTER INSERT OR UPDATE OR DELETE ON doctag_documents
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_doctag_statistics();

-- Add constraint to prevent gaps in tag numbers
ALTER TABLE doctag_documents
ADD CONSTRAINT continuous_tag_numbers
CHECK (
  tag_number = (
    SELECT COALESCE(MAX(tag_number), 0) + 1
    FROM doctag_documents d2
    WHERE d2.tag_type = doctag_documents.tag_type
    AND d2.id != doctag_documents.id
  )
);

-- Create function to get tag statistics
CREATE OR REPLACE FUNCTION get_tag_statistics(p_tag_type char(1))
RETURNS TABLE (
  total_count bigint,
  active_count bigint,
  inactive_count bigint,
  last_number integer,
  first_created timestamptz,
  last_created timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    total_tags,
    active_tags,
    inactive_tags,
    last_tag_number,
    first_created,
    last_created
  FROM doctag_statistics
  WHERE tag_type = p_tag_type;
END;
$$ LANGUAGE plpgsql;