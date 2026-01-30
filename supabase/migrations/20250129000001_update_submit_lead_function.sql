
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
