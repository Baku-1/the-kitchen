-- migration_20260312000003_add_applications_table.sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stage_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  location TEXT,
  sample_link TEXT,
  social_handle TEXT,
  bio TEXT,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime on applications
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Update users table with potential missing fields if they aren't there
-- (Ensuring display_name, city, country, genre, bio exist - they should from schema.sql but just in case)
ALTER TABLE users ADD COLUMN IF NOT EXISTS stage_name TEXT;
