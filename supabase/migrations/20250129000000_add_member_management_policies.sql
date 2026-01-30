-- Add RLS policies for paid_members
ALTER TABLE public.paid_members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admin) to manage paid_members
CREATE POLICY "Allow authenticated full access on paid_members"
ON public.paid_members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public read access to wechat_group_qr (for checking active QR)
-- Note: This might overlap with existing policy "Allow public read active qr", but let's ensure authenticated users have full access
ALTER TABLE public.wechat_group_qr ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access on wechat_group_qr"
ON public.wechat_group_qr
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure wechat-groups bucket exists and has policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('wechat-groups', 'wechat-groups', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files in wechat-groups
CREATE POLICY "Public Access wechat-groups"
ON storage.objects FOR SELECT
USING ( bucket_id = 'wechat-groups' );

-- Allow authenticated users to upload/update/delete in wechat-groups
CREATE POLICY "Authenticated users can upload wechat-groups"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wechat-groups'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update wechat-groups"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wechat-groups'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete wechat-groups"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wechat-groups'
  AND auth.role() = 'authenticated'
);
