
-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public teachers are viewable by everyone" 
ON teachers FOR SELECT 
USING (true);

CREATE POLICY "Teachers are insertable by authenticated users" 
ON teachers FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Teachers are updatable by authenticated users" 
ON teachers FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers are deletable by authenticated users" 
ON teachers FOR DELETE 
USING (auth.role() = 'authenticated');

-- Insert initial data (The 4 teachers you requested)
INSERT INTO teachers (name, title, description, image_url, tags, display_order)
VALUES 
  ('Michael 老师', '资深架构师', '拥有超过20年的软件开发与架构设计经验，曾任职于多家全球知名科技公司。', 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20portrait%20of%20a%20mature%20male%20architect%2C%20asian%2C%2045%20years%20old%2C%20confident%20and%20wise%2C%20business%20attire%2C%20high%20quality&image_size=square', ARRAY['系统架构', '20年实战'], 1),
  ('James 老师', 'AI技术总监', '专注于企业级AI解决方案落地，带领团队完成了多个从0到1的AI项目。', 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20portrait%20of%20a%20male%20technical%20director%2C%20asian%2C%2040%20years%20old%2C%20professional%20look%2C%20glasses%2C%20office%20environment%2C%20high%20quality&image_size=square', ARRAY['AI落地', '技术管理'], 2),
  ('Leon 老师', '全栈工程师', '热衷于探索前沿技术，擅长使用最新技术栈快速构建高性能Web应用。', 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20portrait%20of%20a%20young%20male%20developer%2C%20asian%2C%2028%20years%20old%2C%20energetic%20and%20smart%2C%20casual%20tech%20wear%2C%20high%20quality&image_size=square', ARRAY['新生代力量', '创新思维'], 3),
  ('Kevin 老师', '高级前端专家', '对前端工程化有深入研究，致力于打造极致流畅的用户交互体验。', 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20portrait%20of%20a%20young%20male%20frontend%20expert%2C%20asian%2C%2030%20years%20old%2C%20creative%20look%2C%20modern%20office%2C%20high%20quality&image_size=square', ARRAY['用户体验', '性能优化'], 4);
