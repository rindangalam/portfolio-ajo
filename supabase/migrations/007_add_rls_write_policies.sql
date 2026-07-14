-- Add write RLS policies for authenticated admin user
-- All policies use auth.uid() IS NOT NULL to ensure only logged-in users can write

-- Skills
CREATE POLICY "Authenticated insert skills"
  ON skills FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update skills"
  ON skills FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete skills"
  ON skills FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Experiences
CREATE POLICY "Authenticated insert experiences"
  ON experiences FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update experiences"
  ON experiences FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete experiences"
  ON experiences FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Social links
CREATE POLICY "Authenticated insert social_links"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update social_links"
  ON social_links FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete social_links"
  ON social_links FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Profile (read is open, only update needs policy)
CREATE POLICY "Authenticated update profile"
  ON profile FOR UPDATE
  USING (auth.uid() IS NOT NULL);
