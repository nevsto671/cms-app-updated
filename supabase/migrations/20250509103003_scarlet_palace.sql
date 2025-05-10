/*
  # Fix user_roles policies to prevent infinite recursion

  1. Changes
    - Drop existing policies that cause infinite recursion
    - Create new policies with proper access control:
      - Users can read their own role
      - Super admins can manage all roles (using a session variable instead of recursive check)
      - Admins can read all roles

  2. Security
    - Maintains RLS protection
    - Prevents infinite recursion
    - Preserves access control hierarchy
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Super admins can do everything" ON user_roles;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;

-- Create new policies without recursion
CREATE POLICY "Users can read their own role"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for super admins using session claim instead of recursive check
CREATE POLICY "Super admins can manage roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  -- Check if user has super_admin role via session claim
  current_setting('request.jwt.claims', true)::json->>'role' = 'super_admin'
)
WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'role' = 'super_admin'
);

-- Allow admins to read all roles
CREATE POLICY "Admins can read all roles"
ON user_roles
FOR SELECT
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'super_admin')
);