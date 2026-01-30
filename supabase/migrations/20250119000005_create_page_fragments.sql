
-- Create page_fragments table
CREATE TABLE IF NOT EXISTS page_fragments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE page_fragments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public fragments are viewable by everyone" 
ON page_fragments FOR SELECT 
USING (true);

CREATE POLICY "Fragments are updatable by authenticated users" 
ON page_fragments FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Fragments are insertable by authenticated users" 
ON page_fragments FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Insert initial data for About Us
INSERT INTO page_fragments (slug, title, content, description)
VALUES 
  (
    'about_us', 
    '关于我们', 
    '"<p>UnixTech 优尼克斯成立于2023年，致力于为个人和企业提供最前沿的AI技术培训与咨询服务。</p><p>我们的愿景是让每个人都能掌握AI工具，提升工作效率，创造更多价值。</p><p>我们拥有一支来自阿里、腾讯、字节跳动等一线互联网大厂的专家讲师团队，拥有丰富的实战经验和教学经验。</p>"',
    '关于我们页面的主要介绍内容'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert initial data for Member Benefits (stored as JSON array)
INSERT INTO page_fragments (slug, title, content, description)
VALUES 
  (
    'member_benefits', 
    '会员权益', 
    '[
      {"title": "AI 课程无限看", "description": "解锁全站所有 AI 实战课程，包括 ChatGPT、Midjourney、Stable Diffusion 等热门主题，保持技能持续更新。"},
      {"title": "专属社群交流", "description": "加入高净值 AI 学习社群，与行业大咖、技术专家零距离交流，获取一手行业资讯与搞钱路子。"},
      {"title": "线下沙龙优先权", "description": "优先获得 UnixTech 举办的线下 AI 沙龙、黑客松等活动的参与资格，拓展人脉圈子。"},
      {"title": "一对一咨询服务", "description": "每月享受一次专家一对一技术咨询或职业规划服务，解决你在 AI 学习和落地中的具体问题。"}
    ]',
    '会员权益列表配置'
  )
ON CONFLICT (slug) DO NOTHING;
