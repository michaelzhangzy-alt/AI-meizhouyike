-- Create paid_members table
CREATE TABLE IF NOT EXISTS public.paid_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT,
    batch_name TEXT,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create wechat_group_qr table
CREATE TABLE IF NOT EXISTS public.wechat_group_qr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    remark TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
    effective_start TIMESTAMPTZ,
    effective_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add member_type to leads table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'member_type') THEN
        ALTER TABLE public.leads ADD COLUMN member_type TEXT DEFAULT 'new';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'matched_paid_member_id') THEN
        ALTER TABLE public.leads ADD COLUMN matched_paid_member_id UUID REFERENCES public.paid_members(id);
    END IF;
END $$;

-- Create RLS policies
ALTER TABLE public.paid_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wechat_group_qr ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read active qr" ON public.wechat_group_qr;

-- Allow read access to active QR codes for everyone
CREATE POLICY "Allow public read active qr" ON public.wechat_group_qr
    FOR SELECT
    USING (status = 'active');

-- Function to standardize phone number
CREATE OR REPLACE FUNCTION public.normalize_phone(phone_input TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove non-digit characters
    RETURN regexp_replace(phone_input, '\D', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to submit lead and check membership
CREATE OR REPLACE FUNCTION public.submit_lead(
    p_name TEXT,
    p_phone TEXT,
    p_wechat TEXT DEFAULT NULL,
    p_course_id UUID DEFAULT NULL,
    p_interested_course TEXT DEFAULT NULL,
    p_source TEXT DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip INET DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_normalized_phone TEXT;
    v_member_record RECORD;
    v_member_type TEXT := 'new';
    v_matched_id UUID := NULL;
    v_qr_info JSONB := NULL;
    v_lead_id UUID;
BEGIN
    -- Normalize phone
    v_normalized_phone := public.normalize_phone(p_phone);
    
    -- Check if exists in paid_members
    SELECT id INTO v_matched_id
    FROM public.paid_members
    WHERE normalize_phone(phone) = v_normalized_phone
    LIMIT 1;
    
    IF v_matched_id IS NOT NULL THEN
        v_member_type := 'old_paid';
        
        -- Get active QR code
        SELECT jsonb_build_object(
            'image_url', image_url,
            'title', title,
            'remark', remark
        ) INTO v_qr_info
        FROM public.wechat_group_qr
        WHERE status = 'active'
        LIMIT 1;
    END IF;
    
    -- Insert into leads
    INSERT INTO public.leads (
        name, phone, wechat, course_id, interested_course, 
        source, page_url, user_agent, ip, 
        member_type, matched_paid_member_id
    ) VALUES (
        p_name, p_phone, p_wechat, p_course_id, p_interested_course,
        p_source, p_page_url, p_user_agent, p_ip,
        v_member_type, v_matched_id
    ) RETURNING id INTO v_lead_id;
    
    -- Return result
    RETURN jsonb_build_object(
        'success', true,
        'member_type', v_member_type,
        'qr_info', v_qr_info,
        'lead_id', v_lead_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage setup
-- We'll handle storage buckets and policies more carefully
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('wechat-groups', 'wechat-groups', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Only create policy if it doesn't exist (using a specific name)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Wechat Groups Public Access'
    ) THEN
        CREATE POLICY "Wechat Groups Public Access" ON storage.objects 
        FOR SELECT USING (bucket_id = 'wechat-groups');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Wechat Groups Insert Access'
    ) THEN
        CREATE POLICY "Wechat Groups Insert Access" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'wechat-groups');
    END IF;
END $$;
