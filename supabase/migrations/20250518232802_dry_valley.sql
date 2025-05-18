/*
  # Fix super admin role

  1. Changes
    - Ensures the admin@nevsto.com user has super_admin role
    - Adds proper RLS policies for super admin access
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