/*
  # Make admin@nevsto.com a super administrator

  1. Changes
    - Adds the admin@nevsto.com user to the user_roles table with role 'super_admin'
    - Updates the role if the user already exists
    - Ensures RLS is enabled on the user_roles table
    - Adds a policy for super admins to have full access
*/

DO $$ 
BEGIN
  -- First ensure the user exists and get their ID
  WITH user_id AS (
    SELECT id 
    FROM auth.users 
    WHERE email = 'admin@nevsto.com'
    LIMIT 1
  )
  -- Then insert or update their role to super_admin
  INSERT INTO user_roles (user_id, role)
  SELECT id, 'super_admin'
  FROM user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'super_admin';

  -- Ensure RLS is enabled
  ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

  -- Add policy for super admin access
  DROP POLICY IF EXISTS "Super admins have full access" ON user_roles;
  CREATE POLICY "Super admins have full access"
    ON user_roles
    FOR ALL
    TO authenticated
    USING (
      (current_setting('request.jwt.claims', true)::json ->> 'role')::text = 'super_admin'
    )
    WITH CHECK (
      (current_setting('request.jwt.claims', true)::json ->> 'role')::text = 'super_admin'
    );
END $$;