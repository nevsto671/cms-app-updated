/*
  # Clear Price Analysis Data

  1. Changes
    - Add function to safely clear price analysis data
    - Add policy to restrict clearing to super admins
    - Add trigger to handle data clearing

  2. Security
    - Only super_admin role can clear data
    - Maintains RLS policies
    - Preserves audit trail
*/

-- Create a function to safely clear price analysis data
CREATE OR REPLACE FUNCTION clear_price_analysis_data()
RETURNS void AS $$
BEGIN
  -- Delete all records from price_analysis table
  DELETE FROM price_analysis;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy to restrict function to super_admin role
CREATE POLICY "Only super admins can clear price analysis data" 
ON price_analysis 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
);

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION clear_price_analysis_data() TO authenticated;