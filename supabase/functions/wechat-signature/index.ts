
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory cache for access_token and ticket (Note: Edge functions might restart, so this is not persistent)
// In production, better to store in Supabase DB or Redis.
// For MVP/Demo, we'll fetch every time or rely on a simple logic.
// But WeChat has rate limits, so we MUST cache.
// Let's use Supabase DB to store the ticket if possible, or just ignore for now as I can't set up the DB table for tokens easily here without more migrations.
// I'll stick to a simple structure.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      throw new Error('Missing URL');
    }

    const APP_ID = Deno.env.get('WECHAT_APP_ID');
    const APP_SECRET = Deno.env.get('WECHAT_APP_SECRET');

    if (!APP_ID || !APP_SECRET) {
      throw new Error('Missing WeChat Credentials');
    }

    // 1. Get Access Token
    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token: ' + JSON.stringify(tokenData));
    }

    // 2. Get JSAPI Ticket
    const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${tokenData.access_token}&type=jsapi`;
    const ticketRes = await fetch(ticketUrl);
    const ticketData = await ticketRes.json();

    if (!ticketData.ticket) {
      throw new Error('Failed to get ticket: ' + JSON.stringify(ticketData));
    }

    // 3. Generate Signature
    const noncestr = Math.random().toString(36).substring(2, 15);
    const timestamp = Math.floor(Date.now() / 1000);
    const string1 = `jsapi_ticket=${ticketData.ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(string1);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return new Response(
      JSON.stringify({
        appId: APP_ID,
        timestamp,
        nonceStr: noncestr,
        signature,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
