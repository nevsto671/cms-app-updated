/*
  # Add Admin Role and Permissions

  1. Changes
    - Creates a user_role entry for admin@nevsto.com as super_admin
    - Adds admin-specific policies for price_analysis table
    
  2. Security
    - Enables super_admin to bypass RLS
    - Maintains existing policies for regular users
*/

-- First ensure the user_roles table has RLS enabled
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Insert admin role for the specified user
INSERT INTO user_roles (user_id, role)
SELECT 
  id as user_id,
  'super_admin' as role
FROM auth.users 
WHERE email = 'admin@nevsto.com'
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin';

-- Add admin bypass policy for price_analysis table
CREATE POLICY "Super admins can bypass RLS"
ON price_analysis
TO authenticated
USING (
  (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'super_admin'
)
WITH CHECK (
  (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'super_admin'
);