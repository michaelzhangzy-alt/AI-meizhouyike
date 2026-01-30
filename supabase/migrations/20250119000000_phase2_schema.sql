
-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  instructor TEXT NOT NULL,
  schedule_time TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_schedule_time ON courses(schedule_time);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read published courses" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow full management for authenticated" ON courses
  FOR ALL USING (auth.role() = 'authenticated');

GRANT SELECT ON courses TO anon;
GRANT ALL ON courses TO authenticated;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow full management for authenticated" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

GRANT SELECT ON categories TO anon;
GRANT ALL ON categories TO authenticated;

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  seo_title TEXT,
  seo_keywords TEXT,
  seo_description TEXT,
  views INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow full management for authenticated" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

GRANT SELECT ON articles TO anon;
GRANT ALL ON articles TO authenticated;

-- 4. Share Configs Table
CREATE TABLE IF NOT EXISTS share_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_configs_path ON share_configs(page_path);
CREATE INDEX IF NOT EXISTS idx_share_configs_active ON share_configs(is_active);

ALTER TABLE share_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read active configs" ON share_configs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow full management for authenticated" ON share_configs
  FOR ALL USING (auth.role() = 'authenticated');

GRANT SELECT ON share_configs TO anon;
GRANT ALL ON share_configs TO authenticated;

-- 5. Alter Leads Table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'course_id') THEN
        ALTER TABLE leads ADD COLUMN course_id UUID REFERENCES courses(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN
        ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_course_id ON leads(course_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Update Leads RLS (Allow authenticated to see all leads)
-- Assuming previous policy was just INSERT for anon. Now we need READ for authenticated.
CREATE POLICY "Allow full management for authenticated" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

GRANT ALL ON leads TO authenticated;
