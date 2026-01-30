-- Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for all users" ON leads;
DROP POLICY IF EXISTS "Enable select for all users" ON leads;
DROP POLICY IF EXISTS "Allow public insert" ON leads;
DROP POLICY IF EXISTS "Allow public select" ON leads;

-- Re-create policies clearly
CREATE POLICY "Allow public insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON leads FOR SELECT USING (true);

-- Grant privileges explicitly to anon role
GRANT INSERT, SELECT ON TABLE leads TO anon;
