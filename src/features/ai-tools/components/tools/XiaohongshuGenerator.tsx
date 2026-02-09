import { useState } from 'react';
import { createParser } from 'eventsource-parser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function XiaohongshuGenerator() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const updateResult = (newText: string) => {
    setResult(prev => prev + newText);
  };

  const handleGenerate = async () => {
    if (!topic) return;

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // 构造 Prompt
      const query = `请帮我写一篇小红书爆款笔记。\n主题：${topic}\n${keywords ? `关键词：${keywords}\n` : ''}\n要求：\n1. 标题要吸引人，带emoji\n2. 正文分段清晰，多用emoji，语气活泼亲切（家人们、绝绝子等）\n3. 结尾带相关话题标签\n4. 重点突出，干货满满`;

      // 直接调用 fortune-teller 接口（因为它是一个通用的 Coze 代理）
      const response = await fetch('https://zkfehoobtmqafzskodvi.supabase.co/functions/v1/fortune-teller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
            query: query,
            // 注意：这里仍然使用相同的 bot_id，或者您可以替换为专门的小红书 bot_id
            bot_id: "7603961930159505435", 
            user_id: "user_" + Math.random().toString(36).substring(7)
        }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      if (!response.body) throw new Error('No response body');

      // 使用 eventsource-parser 创建标准解析器
      const parser = createParser({
        onEvent: (event) => {
          // 直接处理事件，不再检查 event.type === 'event'，因为 ParsedEvent 本身就是事件
          try {
            if (event.data === '[DONE]') return;
            const data = JSON.parse(event.data);
            let newContent = '';

            if (event.event === 'conversation.message.delta') {
                if (data.content && typeof data.content === 'string') {
                    newContent = data.content;
                } else if (data.delta && typeof data.delta === 'string') {
                    newContent = data.delta;
                }
            }
            else if (!event.event && !data.event) {
                 if (data.content && typeof data.content === 'string') {
                     const trimmedContent = data.content.trim();
                     if (!trimmedContent.startsWith('{')) {
                        newContent = data.content;
                     }
                 }
            }

            if (newContent) {
                const trimmed = newContent.trim();
                if (trimmed.startsWith('{"') || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
                    return;
                }
                updateResult(newContent);
            }
          } catch (e) {
            // ignore
          }
        }
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.feed(decoder.decode(value));
      }

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 grid gap-8 lg:grid-cols-2">
      {/* 左侧：输入区 */}
      <Card className="p-6 h-fit">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-red-100 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">AI 生成配置</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              笔记主题 <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="例如：杭州周末去哪玩、显瘦穿搭..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关键词 (选填)
            </label>
            <Input
              placeholder="例如：西湖、拍照、美食..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={handleGenerate}
            disabled={isLoading || !topic}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在疯狂创作中...
              </>
            ) : (
              '✨ 一键生成爆款文案'
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-4">
            * 提示：需要配置 Supabase Edge Function 才能连接真实 AI 模型。
          </div>
        </div>
      </Card>

      {/* 右侧：结果展示区 */}
      <Card className="p-6 min-h-[400px] flex flex-col bg-gray-50/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">生成结果</h2>
          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-3 w-3 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  复制
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm overflow-auto">
          {result ? (
            <article className="prose prose-sm prose-red max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Sparkles className="w-12 h-12 mb-2 opacity-20" />
              <p>在左侧输入主题，点击生成</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
