/*
  # Create initial admin user

  1. Changes
    - Creates the initial admin user with email admin@nevsto.com
    - Enables row level security on auth.users
    - Adds policy for authenticated users to read their own data
*/

-- Create the initial admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@nevsto.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Add RLS policy
CREATE POLICY "Users can read own data" 
  ON auth.users
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);