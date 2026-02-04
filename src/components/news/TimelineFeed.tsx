import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Share2, Bookmark, Clock } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  created_at: string;
  external_url?: string;
  type: 'original' | 'external';
}

interface TimelineFeedProps {
  articles: Article[];
}

export function TimelineFeed({ articles }: TimelineFeedProps) {
  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

      <div className="space-y-8">
        {articles.map((article) => (
          <div key={article.id} className="relative pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-600 z-10 group-hover:scale-125 transition-transform" />

            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
                {article.external_url && (
                  <a 
                    href={article.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                {article.type === 'external' ? (
                  <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                ) : (
                  <Link to={`/news/${article.id}`}>{article.title}</Link>
                )}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                {article.summary || '暂无摘要'}
              </p>

              {/* Interactions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  #AI资讯
                </span>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors group/btn">
                    <Share2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    <span>分享</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors group/btn">
                    <Bookmark className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    <span>收藏</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}