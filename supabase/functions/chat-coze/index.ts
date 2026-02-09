
console.log("Starting Chat-Coze STATIC V2 Version...");

Deno.serve(async (req) => {
  // 1. 处理 CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  // 2. 无论发生什么，直接返回固定内容
  // 关键：不读取 req.body，不读取 req.json()
  return new Response(
    JSON.stringify({ 
        content: `✅ 静态 V2 响应成功！\n部署时间: ${new Date().toISOString()}\n如果你看到这个，说明后端没死，只是不能读 Body。`,
        isError: false
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
})
