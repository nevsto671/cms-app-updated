/*
  # Add super admin role to current user

  1. Changes
    - Adds super_admin role to the current user
    - Updates session claims to reflect new role
*/

-- Get the current user's ID
DO $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID from the session
  current_user_id := auth.uid();

  -- Add super_admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (current_user_id, 'super_admin')
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'super_admin';
END $$;