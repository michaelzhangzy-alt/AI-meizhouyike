
import React from 'react';
import { Link } from 'react-router-dom';
// import { Card } from '../ui/card'; 
// import { Badge } from '../ui/badge';
// import { ExternalLink, ArrowRight } from 'lucide-react';
// import { getFeaturedTools } from '../../features/ai-tools/data/tools';

export function HomeToolsSection() {
  // Hardcoded for debugging to fix white screen
  const featuredTools = [
    {
      id: 106,
      title: "小红书文案生成器",
      desc: "本站自研工具！一键生成爆款小红书风格文案，带 Emoji 和标签。",
      icon: "📕",
      tag: "自研工具",
      category: "Writing",
      link: "/ai-tools/xiaohongshu",
      isExternal: false,
      isFeatured: true,
      badge: "自研"
    },
    {
      id: 107,
      title: "AI 算命 (Fortune Teller)",
      desc: "测测你的今日运势、爱情运、财运，AI 结合传统易经为您解惑。",
      icon: "🔮",
      tag: "趣味测试",
      category: "Fun",
      link: "/ai-tools/fortune",
      isExternal: false,
      isFeatured: true,
      badge: "热门"
    },
    {
      id: 102,
      title: "Trae",
      desc: "集成本地代码库的 AI 编程助手，支持 GPT-4o 和 Claude 3.5，让编程更简单。",
      icon: "💻",
      tag: "编程辅助",
      category: "Coding",
      link: "https://www.trae.ai/",
      isExternal: true,
      isFeatured: true,
      badge: "神器"
    }
  ];

  console.log('HomeToolsSection rendering (inline data)', featuredTools);

  if (!featuredTools.length) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">AI Lab 热门工具 (Inline Mode)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <Link 
                key={tool.id} 
                to={tool.link.startsWith('http') ? '#' : tool.link}
                onClick={(e) => {
                    if (tool.link.startsWith('http')) {
                        e.preventDefault();
                        window.open(tool.link, '_blank');
                    }
                }}
                className="block group"
            >
                <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-3xl">{tool.icon}</div>
                        {tool.badge && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                {tool.badge}
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-blue-600">
                        {tool.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {tool.desc}
                    </p>
                    <div className="text-blue-600 text-sm font-bold flex items-center">
                        立即体验 &rarr;
                    </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
