/*
  # Optimize tagging configuration database

  1. Changes
    - Add composite indexes for faster lookups
    - Create partial indexes for active documents
    - Add automatic timestamp updates
    - Implement tag sequence validation
    - Create materialized view for statistics
    - Add helper functions
    
  2. Security
    - Maintain existing RLS policies
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

-- Create function to get next tag number
CREATE OR REPLACE FUNCTION get_next_tag_number(p_tag_type char(1))
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(tag_number) + 1
     FROM doctag_documents
     WHERE tag_type = p_tag_type),
    1
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to validate tag sequence
CREATE OR REPLACE FUNCTION validate_tag_sequence()
RETURNS trigger AS $$
DECLARE
  next_number integer;
BEGIN
  next_number := get_next_tag_number(NEW.tag_type);
  IF NEW.tag_number != next_number THEN
    RAISE EXCEPTION 'Tag number must be sequential within tag type. Expected: %, Got: %', next_number, NEW.tag_number;
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