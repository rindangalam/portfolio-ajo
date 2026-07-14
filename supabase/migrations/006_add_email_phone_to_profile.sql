-- Add email and phone columns to profile table
ALTER TABLE profile ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS phone text;
