-- Add DELETE RLS policy for contact_messages
-- This was missing — admin could not delete messages

CREATE POLICY "Authenticated delete contact_messages"
  ON contact_messages FOR DELETE
  USING (auth.uid() IS NOT NULL);
