-- 005: Add projects storage bucket for project images + screenshots
-- Run this in Supabase SQL Editor AFTER running 003

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true,
  5242880,  -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Public read policy
CREATE POLICY "Public read project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'projects');

-- Anyone can upload
CREATE POLICY "Anyone can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'projects');

-- Anyone can update
CREATE POLICY "Anyone can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'projects');

-- Anyone can delete
CREATE POLICY "Anyone can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'projects');
