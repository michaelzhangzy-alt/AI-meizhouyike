import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function XiaohongshuGenerator() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // 调用 Supabase Edge Function（生产环境安全模式）
      const { data, error } = await supabase.functions.invoke('generate-xiaohongshu', {
        body: { topic, keywords },
      });

      if (error) throw error;

      if (data?.content) {
        setResult(data.content);
      } else {
        throw new Error('未返回有效内容');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || '生成失败，请稍后重试');
      // 模拟生成（为了演示效果，如果API未配置）
      if (err.message?.includes('FunctionsFetchError') || err.message?.includes('404')) {
         setResult(`> ⚠️ 注意：后端 API 尚未配置，以下为模拟生成结果。请按照教程配置 Supabase Edge Function。\n\n# ${topic} | 绝绝子！这波操作真的绝了 ✨\n\n家人们，今天一定要给你们安利这个神器！💖\n\n${keywords ? `关键词涉及到：${keywords}\n\n` : ''}真的太好用了，亲测有效！不踩雷！\n\n## 👇 重点看这里\n1. 第一点优势...\n2. 第二点优势...\n\n#推荐 #好物分享 #${topic} #宝藏神器`);
      }
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
