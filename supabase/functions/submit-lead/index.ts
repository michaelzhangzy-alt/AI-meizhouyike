import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { name, phone, wechat, source, interestedCourse, page_url, user_agent } = await req.json()

    // 1. Insert into DB
    const { data, error: dbError } = await supabaseClient
      .from('leads')
      .insert([
        {
          name,
          phone,
          wechat,
          source,
          interested_course: interestedCourse,
          page_url,
          user_agent
        },
      ])
      .select()

    if (dbError) throw dbError

    // 2. Send Notification (Simulated for MVP, or use SMTP/Resend)
    // To actually send emails, you need an SMTP service or API (like Resend).
    // Here we just log it, which is visible in Supabase Dashboard Logs.
    console.log(`New Lead Received: ${name} (${phone})`)
    
    // Example: Using Resend (Requires RESEND_API_KEY)
    /*
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: '312150036@qq.com',
        subject: `新报名: ${name}`,
        html: `<p>姓名: ${name}</p><p>电话: ${phone}</p><p>微信: ${wechat}</p>`
      })
    })
    */

    return new Response(
      JSON.stringify({ message: 'Lead submitted successfully', data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
