import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Bookmark } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  cover_image: string;
  created_at: string;
  type: 'original' | 'external';
  summary?: string;
}

interface MasonryFeedProps {
  articles: Article[];
}

export function MasonryFeed({ articles }: MasonryFeedProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {articles.map((article) => (
        <div key={article.id} className="break-inside-avoid relative group">
          <Link to={`/news/${article.id}`} className="block">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-slate-200/50 group-hover:-translate-y-1">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={article.cover_image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                
                {/* Floating Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`
                    px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm
                    ${article.type === 'original' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/90 text-slate-900'
                    }
                  `}>
                    {article.type === 'original' ? 'ORIGINAL' : 'LINK'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                {/* Meta Footer with Interactions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.id}&backgroundColor=e2e8f0`} 
                        alt="Author" 
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">UNIXTECH</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle share
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle bookmark
                      }}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}