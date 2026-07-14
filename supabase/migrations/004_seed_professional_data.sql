-- 004: Seed professional data for portfolio
-- Run this in Supabase SQL Editor AFTER running 002 and 003

-- Profile update (only runs if id=1 exists)
UPDATE profile SET
  full_name = 'Rindang Alam Nur Muhammad',
  headline = 'Fullstack Developer',
  bio = 'Building systems that connect things together.',
  about_text = E'Fullstack developer with 3+ years of experience building scalable web applications. Passionate about clean architecture, real-time systems, and developer tooling.\n\nI enjoy working across the entire stack — from crafting responsive UIs with React and Next.js to designing robust APIs with Node.js and Python. Most of my recent work involves Supabase, PostgreSQL, and cloud-native deployment.\n\nWhen I''m not coding, you''ll find me exploring new technologies, contributing to open source, or diving into system design topics.',
  location = 'Indonesia',
  available_for_hire = true
WHERE id = 1;

-- Skills (18 entries)
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
  ('React', 'frontend', 5, 1),
  ('Next.js', 'frontend', 5, 2),
  ('TypeScript', 'frontend', 5, 3),
  ('Tailwind CSS', 'frontend', 4, 4),
  ('Vue.js', 'frontend', 3, 5),
  ('Node.js', 'backend', 5, 6),
  ('Python', 'backend', 4, 7),
  ('Express.js', 'backend', 4, 8),
  ('FastAPI', 'backend', 3, 9),
  ('NestJS', 'backend', 3, 10),
  ('PostgreSQL', 'database', 4, 11),
  ('MongoDB', 'database', 4, 12),
  ('Redis', 'database', 3, 13),
  ('Supabase', 'database', 5, 14),
  ('Docker', 'devops', 4, 15),
  ('AWS', 'devops', 3, 16),
  ('Vercel', 'devops', 5, 17),
  ('GitHub Actions', 'devops', 4, 18)
ON CONFLICT DO NOTHING;

-- Experiences (3 entries)
INSERT INTO experiences (company, role, description, start_date, end_date, is_current, sort_order) VALUES
  (
    'PT Digital Solusi',
    'Fullstack Developer',
    'Lead development of microservices architecture. Built real-time dashboard with Next.js and Supabase, serving 10K+ daily active users. Optimized API response times by 40% through query optimization and caching strategies.',
    '2023-01-01',
    NULL,
    true,
    1
  ),
  (
    'Startup Hub Indonesia',
    'Frontend Developer',
    'Developed customer-facing React dashboard for SaaS analytics platform. Created reusable component library adopted by 5 team members. Implemented CI/CD pipeline reducing deployment time from 30min to 5min.',
    '2021-06-01',
    '2022-12-31',
    false,
    2
  ),
  (
    'TechCorp Asia',
    'Software Engineering Intern',
    'Built REST APIs with Node.js and Express. Wrote unit and integration tests achieving 85% coverage. Participated in agile sprints and code reviews.',
    '2020-01-01',
    '2021-05-31',
    false,
    3
  )
ON CONFLICT DO NOTHING;

-- Social links (3 entries)
INSERT INTO social_links (platform, url, sort_order) VALUES
  ('github', 'https://github.com/ranm', 1),
  ('linkedin', 'https://linkedin.com/in/ranm', 2),
  ('email', 'mailto:ranm@example.com', 3)
ON CONFLICT DO NOTHING;
