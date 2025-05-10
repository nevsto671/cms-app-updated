/*
  # Create File Cabinet Database Schema

  1. New Tables
    - `file_cabinet_folders`
      - `id` (uuid, primary key)
      - `name` (text)
      - `parent_id` (uuid, self-referencing foreign key)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `next_due_date` (date)
      - `folder_count` (integer)
      - `action_count` (integer)
    
    - `file_cabinet_actions`
      - `id` (uuid, primary key)
      - `folder_id` (uuid, references file_cabinet_folders)
      - `action_type` (text)
      - `action_id` (text)
      - `order_id` (text)
      - `mod_id` (text)
      - `state` (text)
      - `status` (text)
      - `receipt` (boolean)
      - `goals` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create folders table
CREATE TABLE file_cabinet_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES file_cabinet_folders(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  next_due_date date,
  folder_count integer DEFAULT 0,
  action_count integer DEFAULT 0
);

-- Create actions table
CREATE TABLE file_cabinet_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES file_cabinet_folders(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_id text NOT NULL,
  order_id text NOT NULL,
  mod_id text NOT NULL,
  state text NOT NULL,
  status text NOT NULL,
  receipt boolean DEFAULT false,
  goals text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE file_cabinet_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_cabinet_actions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_folders_parent ON file_cabinet_folders(parent_id);
CREATE INDEX idx_folders_created_by ON file_cabinet_folders(created_by);
CREATE INDEX idx_actions_folder ON file_cabinet_actions(folder_id);

-- Create policies for folders
CREATE POLICY "Users can manage their own folders"
  ON file_cabinet_folders
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Create policies for actions
CREATE POLICY "Users can manage actions in their folders"
  ON file_cabinet_actions
  FOR ALL
  TO authenticated
  USING (
    folder_id IN (
      SELECT id FROM file_cabinet_folders 
      WHERE created_by = auth.uid()
    )
  )
  WITH CHECK (
    folder_id IN (
      SELECT id FROM file_cabinet_folders 
      WHERE created_by = auth.uid()
    )
  );

-- Create function to update folder counts
CREATE OR REPLACE FUNCTION update_folder_counts()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment counts
    UPDATE file_cabinet_folders
    SET 
      folder_count = folder_count + 1
    WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement counts
    UPDATE file_cabinet_folders
    SET 
      folder_count = folder_count - 1
    WHERE id = OLD.parent_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update action counts
CREATE OR REPLACE FUNCTION update_action_counts()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment count
    UPDATE file_cabinet_folders
    SET 
      action_count = action_count + 1
    WHERE id = NEW.folder_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement count
    UPDATE file_cabinet_folders
    SET 
      action_count = action_count - 1
    WHERE id = OLD.folder_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER folder_counts_trigger
  AFTER INSERT OR DELETE ON file_cabinet_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_folder_counts();

CREATE TRIGGER action_counts_trigger
  AFTER INSERT OR DELETE ON file_cabinet_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_action_counts();