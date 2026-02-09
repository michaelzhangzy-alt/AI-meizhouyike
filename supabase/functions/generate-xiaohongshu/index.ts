// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  // 1. 处理 CORS (跨域请求)
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // 2. 获取请求体中的数据
    const { topic, keywords } = await req.json()

    if (!topic) {
      throw new Error('Missing topic')
    }

    // 3. 准备调用 AI API
    // 优先从环境变量获取，如果未设置则使用默认 key (注意：实际生产环境请务必使用环境变量)
    const API_KEY = Deno.env.get('SILICONFLOW_API_KEY') || 'sk-uuriupdoksavucfemlmcagzqbgqgzwvkvemvwxwoxxocgqvq'
    const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'

    if (!API_KEY) {
      throw new Error('Missing API Key configuration')
    }

    const systemPrompt = `
    你是一个资深的小红书爆款文案创作者。请根据用户提供的主题和关键词，创作一篇小红书笔记。
    要求：
    1. 标题：吸引眼球，使用emoji，包含悬念或强烈情绪。
    2. 正文：口语化，多用emoji，分段清晰，有互动感。
    3. 标签：在文末添加5-8个相关标签。
    4. 风格：真诚分享，或者情绪价值拉满。
    `

    const userPrompt = `主题：${topic}\n关键词：${keywords || '无'}`

    // 4. 发起请求
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V2.5', // 使用 DeepSeek V2.5
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
        throw new Error(data.error.message)
    }

    const content = data.choices[0].message.content

    // 5. 返回结果
    return new Response(
      JSON.stringify({ content }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
})
