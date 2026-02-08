
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Copy, Check, Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// 预设模板，方便用户一键填入
const INPUT_TEMPLATE = `姓名：
性别：
出生地：
出生日期：
历法：
当前时间：
八字信息：`;

export function FortuneTeller() {
  const [userInfo, setUserInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // 模拟流式打字机效果的更新
  const updateResult = (newText: string) => {
    setResult(prev => prev + newText);
  };

  const handleGenerate = async () => {
    if (!userInfo.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(''); // 清空旧结果

    try {
      // 构造 Prompt
      const query = `请根据以下信息进行专业的八字命理分析：\n${userInfo}\n\n要求：\n1. 风格：亲切、专业、实诚。\n2. 结构：先分析五行强弱，再看十神心性，最后讲流年运势。\n3. 语气：像老朋友聊天一样，不要太晦涩。`;

      const response = await fetch('https://zkfehoobtmqafzskodvi.supabase.co/functions/v1/fortune-teller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
            query: query,
            bot_id: "7603961930159505435", 
            user_id: "user_" + Math.random().toString(36).substring(7)
        }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('data:')) {
                try {
                    const jsonStr = line.trim().substring(5).trim();
                    if (!jsonStr) continue;
                    
                    const data = JSON.parse(jsonStr);
                    let newContent = '';
                    
                    // 过滤掉系统消息，只提取真正的回答内容
                    // 1. 忽略 generate_answer_finish 等系统事件
                    if (data.msg_type === 'generate_answer_finish') continue;
                    if (data.event === 'done') continue;

                    // 2. 识别 Coze V3 协议
                    if (data.event === 'conversation.message.delta' || data.type === 'answer') {
                        // 优先取 data.content
                        if (data.content && typeof data.content === 'string') {
                            newContent = data.content;
                        } 
                        // 其次取 data.message.content
                        else if (data.message?.content && typeof data.message.content === 'string') {
                            newContent = data.message.content;
                        }
                        // 最后取 data.delta
                        else if (data.delta && typeof data.delta === 'string') {
                            newContent = data.delta;
                        }
                    } 
                    // 3. 兼容旧版或简单协议
                    else if (!data.event && !data.msg_type) {
                         if (typeof data.content === 'string') newContent = data.content;
                    }

                    // 严格过滤：如果 newContent 包含 JSON 结构（如 {"name":...}），则认为是漏网的系统消息，强制丢弃
                    if (newContent && (newContent.trim().startsWith('{') || newContent.trim().startsWith('{"'))) {
                        try {
                            JSON.parse(newContent); // 尝试解析，如果成功则是 JSON，丢弃
                            continue;
                        } catch (e) {
                            // 不是合法 JSON，可能是普通文本（如代码块），保留
                        }
                    }

                    if (newContent) {
                        updateResult(newContent);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
      }

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || '大师正在闭关，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fillTemplate = () => {
      if (!userInfo) {
          setUserInfo(INPUT_TEMPLATE);
      } else {
          setUserInfo(prev => prev + '\n' + INPUT_TEMPLATE);
      }
  };

  return (
    <div className="my-8 grid gap-8 lg:grid-cols-2">
      {/* 左侧：输入配置区 (对齐小红书生成器) */}
      <Card className="p-6 h-fit border-purple-100 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">命理档案输入</h2>
        </div>

        <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg text-sm text-purple-800 mb-4">
                <p className="font-medium mb-2">👋 哈喽宝子们！我是实诚又专业的命理师。</p>
                <p className="mb-2">想算得准，这3项信息一定要备齐：</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                    <li>专属档案（性别、出生地、精确时间）</li>
                    <li>八字密码（四柱八字，没排盘我帮你排）</li>
                    <li>定制分析（事业、财运、桃花）</li>
                </ul>
            </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                你的信息 <span className="text-purple-500">*</span>
                </label>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fillTemplate}
                    className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                    <Copy className="w-3 h-3 mr-1" /> 填入模板
                </Button>
            </div>
            
            <Textarea
              placeholder={`在此输入或粘贴信息...\n\n${INPUT_TEMPLATE}`}
              value={userInfo}
              onChange={(e) => setUserInfo(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none focus-visible:ring-purple-500"
            />
          </div>

          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 transition-all hover:scale-[1.02]"
            onClick={handleGenerate}
            disabled={isLoading || !userInfo.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                大师正在推演天机...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                开启命运对话
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-4 text-center">
            * AI 内容仅供娱乐参考，请相信科学，理性看待。
          </div>
        </div>
      </Card>

      {/* 右侧：结果展示区 (对齐小红书生成器) */}
      <Card className="p-6 min-h-[500px] flex flex-col bg-slate-50/50 border-slate-200 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            大师批注
          </h2>
          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 bg-white hover:bg-purple-50 border-slate-200"
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-3 w-3 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  复制结果
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex-1 rounded-xl border border-slate-100 bg-white p-6 shadow-sm overflow-auto transition-all">
          {result ? (
            <article className="prose prose-sm prose-purple max-w-none prose-p:leading-relaxed prose-headings:text-purple-900">
              <ReactMarkdown>{result}</ReactMarkdown>
              {isLoading && (
                  <div className="flex items-center gap-2 mt-4 text-purple-400 animate-pulse">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animation-delay-200"></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animation-delay-400"></span>
                  </div>
              )}
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-center">
                  <p className="font-medium text-slate-500">等待输入...</p>
                  <p className="text-xs mt-1">在左侧填入信息，大师马上为您解惑</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
