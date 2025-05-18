/*
  # Clear Price Analysis Data

  1. Changes
    - Safely removes all data from the price_analysis table
    - Preserves table structure and policies
    - Resets the table to empty state

  2. Security
    - Maintains RLS policies
    - Preserves table structure
*/

TRUNCATE TABLE price_analysis;

-- Reset the created_by trigger to ensure it continues working after truncate
DROP TRIGGER IF EXISTS set_created_by_trigger ON price_analysis;
CREATE TRIGGER set_created_by_trigger
    BEFORE INSERT ON price_analysis
    FOR EACH ROW
    EXECUTE FUNCTION set_created_by();