-- 011: Add case-study fields to projects table
-- Run this in Supabase SQL Editor

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS challenges JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN projects.role IS 'Your role in the project (e.g. Fullstack Developer)';
COMMENT ON COLUMN projects.duration IS 'Human-readable duration (e.g. "2025 - 2026" or "3 months")';
COMMENT ON COLUMN projects.year IS 'Release year as integer';
COMMENT ON COLUMN projects.highlights IS 'JSON array of strings: key features / results';
COMMENT ON COLUMN projects.challenges IS 'JSON array of strings: problems solved';
COMMENT ON COLUMN projects.sections IS 'JSON array of {heading, content(markdown)} for the story';