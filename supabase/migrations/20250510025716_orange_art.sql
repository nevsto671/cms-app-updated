/*
  # Create DocTag Central Database Schema

  1. New Tables
    - `doctag_documents`
      - Document metadata and tagging information
    - `doctag_workflows`
      - Workflow definitions and routing rules
    - `doctag_audit_logs`
      - System activity logging
    - `doctag_configurations`
      - System-wide settings
    - `doctag_user_permissions`
      - Extended user permissions for DocTag

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create document table
CREATE TABLE IF NOT EXISTS doctag_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_symbol text NOT NULL CHECK (tag_symbol IN ('⭐', '📦', '📝')),
  tag_type char(1) NOT NULL CHECK (tag_type IN ('S', 'P', 'C')),
  tag_number integer NOT NULL CHECK (tag_number BETWEEN 1 AND 20),
  title text NOT NULL,
  description text,
  file_path text,
  file_size bigint,
  mime_type text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tag_type, tag_number)
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS doctag_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  definition jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS doctag_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create configurations table
CREATE TABLE IF NOT EXISTS doctag_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  description text,
  is_encrypted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, key)
);

-- Create user permissions table
CREATE TABLE IF NOT EXISTS doctag_user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  permission text NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Enable RLS
ALTER TABLE doctag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctag_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctag_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctag_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctag_user_permissions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_doctag_documents_tag ON doctag_documents(tag_type, tag_number);
CREATE INDEX idx_doctag_documents_created_by ON doctag_documents(created_by);
CREATE INDEX idx_doctag_audit_logs_user ON doctag_audit_logs(user_id);
CREATE INDEX idx_doctag_audit_logs_entity ON doctag_audit_logs(entity_type, entity_id);
CREATE INDEX idx_doctag_configurations_category ON doctag_configurations(category);

-- Create RLS policies
CREATE POLICY "Users can read documents"
  ON doctag_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own documents"
  ON doctag_documents
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can read workflows"
  ON doctag_workflows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read audit logs"
  ON doctag_audit_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read configurations"
  ON doctag_configurations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their permissions"
  ON doctag_user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());