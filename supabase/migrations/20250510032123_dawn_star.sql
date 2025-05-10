/*
  # Add last activity tracking

  1. Changes
    - Add last_activity column to user_roles table
    - Add function to update last activity
    - Add trigger to automatically update last activity

  2. Security
    - Maintain existing RLS policies
*/

-- Add last_activity column
ALTER TABLE user_roles
ADD COLUMN last_activity timestamptz DEFAULT now();

-- Create function to update last activity
CREATE OR REPLACE FUNCTION update_user_last_activity()
RETURNS trigger AS $$
BEGIN
  UPDATE user_roles
  SET last_activity = now()
  WHERE user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update last activity on any table access
CREATE OR REPLACE TRIGGER user_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_activity();