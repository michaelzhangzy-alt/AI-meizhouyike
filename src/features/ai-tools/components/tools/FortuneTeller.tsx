
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';
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

      // 使用 eventsource-parser 创建标准解析器
      const parser = createParser({
        onEvent: (event: ParsedEvent | ReconnectInterval) => {
          // 直接处理事件，不再检查 event.type === 'event'，因为 ParsedEvent 本身就是事件
          try {
            // 某些情况下 Coze 会发送 [DONE] 标记
            if (event.data === '[DONE]') return;

            const data = JSON.parse(event.data);
            let newContent = '';

            // ---------------------------------------------------------
            // 严格的 SSE 状态机逻辑
            // ---------------------------------------------------------

            // 1. 核心规则：只认准 conversation.message.delta 事件
            if (event.event === 'conversation.message.delta') {
                if (data.content && typeof data.content === 'string') {
                    newContent = data.content;
                } else if (data.delta && typeof data.delta === 'string') {
                    newContent = data.delta;
                }
            }
            // 2. 兼容规则：处理无 event 头但有标准 content 的消息
            else if (!event.event && !data.event) {
                 if (data.content && typeof data.content === 'string') {
                     const trimmedContent = data.content.trim();
                     if (!trimmedContent.startsWith('{')) {
                        newContent = data.content;
                     }
                 }
            }

            // 3. 兜底防御：再次检查 newContent 是否包含 JSON 乱码
            if (newContent) {
                const trimmed = newContent.trim();
                if (trimmed.startsWith('{"') || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
                    return;
                }
                updateResult(newContent);
            }
          } catch (e) {
            // JSON 解析失败忽略
          }
        }
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // 将 chunk 喂给 parser，由它处理分包、粘包
        parser.feed(decoder.decode(value));
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
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl text-sm text-purple-900 mb-4 border border-purple-100 shadow-sm">
                <p className="font-bold text-base mb-2 flex items-center gap-2">
                    <span className="text-xl">👋</span> 哈喽宝子们！
                </p>
                <p className="mb-3 leading-relaxed text-purple-800">
                    有没有觉得有时候人生像开盲盒？🎁 明明很努力，却总差那么一点点运气？<br/>
                    别慌！今天咱们就用最传统、最严谨的四柱命理，帮你把未来的路看得明明白白！
                </p>
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        想算得准，这3项信息一定要备齐：
                    </p>
                    <ul className="space-y-2 text-purple-800">
                        <li className="flex items-start gap-2">
                            <span className="bg-purple-200 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                            <span><span className="font-medium">专属档案</span>：性别、出生地、精确时间</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-purple-200 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                            <span><span className="font-medium">八字密码</span>：四柱八字，没排盘我帮你排</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-purple-200 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                            <span><span className="font-medium">定制分析</span>：事业、财运、桃花</span>
                        </li>
                    </ul>
                </div>
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
