
console.log("Starting Fortune-Teller PROXY PIPE Version...");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const rawText = await req.text();
    let body = {};
    if (rawText) {
        try { body = JSON.parse(rawText); } catch (e) {}
    }
    
    const { query, bot_id, user_id } = body;
    const COZE_API_KEY = "pat_LHpu5AJvNuzgPD2UpzYeCr4Ma0nZeoXg6UavaRSyRWotCyKfgDJcN6Q4UKgISDuF";
    const COZE_API_URL = 'https://api.coze.cn/v3/chat';

    // 1. 发起流式请求给 Coze
    const cozeResponse = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: bot_id || "7603961930159505435",
        user_id: user_id || "user_" + Math.random().toString(36).substring(7),
        stream: true,
        additional_messages: [
            {
                role: "user",
                content: query || "你好",
                content_type: "text",
                type: "question"
            }
        ]
      }),
    });

    // 2. 直接将 Coze 的流转发给前端 (Proxy Mode)
    // 这样后端不需要解析，也不用担心超时
    return new Response(cozeResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream', // 告诉前端这是 SSE
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 200, // 保持 200 避免前端直接抛错
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
})
