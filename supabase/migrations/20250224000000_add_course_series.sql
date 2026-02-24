-- Create course_series table
create table if not exists course_series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add series_id to courses table
alter table courses add column if not exists series_id uuid references course_series(id);

-- Add indexes
create index if not exists idx_courses_series_id on courses(series_id);
create index if not exists idx_course_series_sort_order on course_series(sort_order);

-- Enable RLS on course_series
alter table course_series enable row level security;

-- Policies for course_series
-- Public can read active series
create policy "Public can view active series"
  on course_series for select
  to anon, authenticated
  using (is_active = true);

-- Admins can manage series (using existing admin check logic or authenticated for now)
create policy "Authenticated users can manage series"
  on course_series for all
  to authenticated
  using (true)
  with check (true);

-- Insert initial series data
insert into course_series (name, slug, sort_order) values
  ('学业辅助神器', 'academic-tools', 1),
  ('职场通用工具', 'workplace-tools', 2),
  ('内容创作助手', 'content-creation', 3),
  ('数据整理与分析', 'data-analysis', 4),
  ('日常效率提升', 'daily-efficiency', 5),
  ('社团/活动管理', 'event-management', 6),
  ('综合实战', 'comprehensive-practice', 7)
on conflict (slug) do nothing;
