-- Add verification columns to contact_messages
-- Enables email confirmation before message is delivered to admin

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_contact_messages_verification_token
  ON contact_messages (verification_token);
