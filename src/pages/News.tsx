
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { NewsCarousel } from '../components/news/NewsCarousel';
import { MasonryFeed } from '../components/news/MasonryFeed';
import { TimelineFeed } from '../components/news/TimelineFeed';

interface Article {
  id: string;
  title: string;
  summary: string;
  cover_image: string;
  created_at: string;
  type: 'original' | 'external';
  external_url?: string;
}

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'original' | 'external'>('all');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Fetch main list
        let query = supabase
          .from('articles')
          .select('id, title, summary, cover_image, created_at, type, external_url')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (filterType !== 'all') {
          query = query.eq('type', filterType);
        }

        const { data, error } = await query;
        if (error) throw error;
        setArticles(data || []);

        // Fetch featured for carousel (only once ideally, but simple here)
        if (featuredArticles.length === 0) {
          const { data: featuredData } = await supabase
            .from('articles')
            .select('id, title, cover_image, type')
            .eq('status', 'published')
            .limit(5);
          
          setFeaturedArticles(featuredData?.map(item => ({
            id: item.id,
            title: item.title,
            image: item.cover_image,
            category: item.type === 'original' ? '深度好文' : '行业快讯'
          })) || []);
        }

      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filterType, featuredArticles.length]);

  return (
    <div className="min-h-screen bg-white">
      <SEO title="AI 资讯 - 优尼克斯教育" description="关注人工智能前沿动态与学员精彩案例" />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">AI 行业资讯</h1>
          <p className="text-lg text-slate-500 mb-8 font-light">精选全球 AI 前沿动态，助你保持技术敏锐度</p>
          
          {/* Carousel */}
          {!loading && featuredArticles.length > 0 && (
            <NewsCarousel items={featuredArticles} />
          )}

          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 overflow-x-auto pb-4 md:pb-0 no-scrollbar mt-12 mb-12">
            {[
              { id: 'all', label: '全部' },
              { id: 'original', label: '原创干货' },
              { id: 'external', label: '外链导读' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as 'all' | 'original' | 'external')}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                  ${filterType === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 transform scale-105' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse break-inside-avoid" />
             ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filterType === 'external' ? (
              <TimelineFeed articles={articles} />
            ) : (
              <MasonryFeed articles={articles} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
