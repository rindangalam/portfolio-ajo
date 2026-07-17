-- Add status text columns to profile table
ALTER TABLE profile ADD COLUMN IF NOT EXISTS status_text text DEFAULT 'Available for hire';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS status_busy_text text DEFAULT 'Currently busy';
