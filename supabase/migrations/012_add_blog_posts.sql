-- Blog posts table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  tags text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public read published posts"
  ON posts FOR SELECT
  USING (is_published = true);

-- Authenticated admin can write
CREATE POLICY "Authenticated insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update posts"
  ON posts FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete posts"
  ON posts FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Optional: seed a welcome post
INSERT INTO posts (title, slug, excerpt, content, tags, is_published, is_featured, published_at)
VALUES (
  'Hello World — Welcome to My Blog',
  'hello-world',
  'Catatan pertama. Tentang apa yang akan saya tulis di blog ini: pengembangan web, arsitektur sistem, dan hal-hal yang saya pelajari.',
  E'## Selamat datang\n\nIni adalah postingan pertama di blog saya.\n\n- Saya akan menulis tentang **web development**, **backend architecture**, dan **tooling**.\n- Kadang ada tutorial, kadang opini, kadang catatan kecil.\n\nTerima kasih sudah mampir. 🚀',
  ARRAY['introduction', 'personal'],
  true,
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- Storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Blog covers are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog');

CREATE POLICY "Authenticated upload blog covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update blog covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete blog covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog' AND auth.role() = 'authenticated');