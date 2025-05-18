/*
  # Clear price analysis data
  
  1. Changes
    - Safely removes all data from the price_analysis table
    - Preserves table structure and policies
    - Only super_admin can execute the deletion
*/

-- Only allow super_admin to delete all data
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  ) THEN
    DELETE FROM price_analysis;
  ELSE
    RAISE EXCEPTION 'Only super administrators can clear all data';
  END IF;
END $$;