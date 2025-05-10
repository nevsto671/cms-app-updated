/*
  # Create super admin role and user

  1. New Tables
    - `user_roles` table to store user roles
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add super_admin role to the initial user
    - Add RLS policies for user_roles table

  3. Security
    - Enable RLS on user_roles table
    - Add policies for role-based access
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'user')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Super admins can do everything"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Users can read their own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Get the ID of our admin user
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@nevsto.com';

  -- Add super_admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'super_admin');
END $$;