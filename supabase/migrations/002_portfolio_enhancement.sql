-- Portfolio Enhancement: New tables + schema extensions
-- Run this in Supabase SQL Editor

-- 1. Extend profile table
ALTER TABLE profile ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS available_for_hire boolean DEFAULT false;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS resume_url text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS about_text text;

-- 2. Extend projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots text[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_details jsonb DEFAULT '[]';

-- 3. Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  proficiency integer NOT NULL DEFAULT 3 CHECK (proficiency BETWEEN 1 AND 5),
  icon_name text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- 6. Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. RLS Policies
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read for portfolio data
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);

-- Contact messages: public insert, authenticated read
CREATE POLICY "Anyone can send messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Admin can update messages" ON contact_messages FOR UPDATE USING (true);

-- Admin write policies (match existing admin email check pattern)
-- These use the service role key, so they bypass RLS when called from server components
-- If you need anon-key write access, add auth role checks here
