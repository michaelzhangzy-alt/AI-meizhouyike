
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { NewsCarousel } from '../components/news/NewsCarousel';
import { MasonryFeed } from '../components/news/MasonryFeed';
import { TimelineFeed } from '../components/news/TimelineFeed';
import { Button } from '../components/ui/button';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'original' | 'external'>('all');

  // 独立加载轮播图数据，确保即使列表加载失败也能尝试显示轮播图
  useEffect(() => {
    const fetchFeatured = async () => {
      if (featuredArticles.length > 0) return;
      try {
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
      } catch (err) {
        console.error('Error fetching featured articles:', err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch main list
        let query = supabase
          .from('articles')
          .select('id, title, summary, cover_image, created_at, type, external_url')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(50);

        if (filterType !== 'all') {
          query = query.eq('type', filterType);
        }

        const { data, error } = await query;

        if (error) throw error;
        setArticles(data || []);

      } catch (error: any) {
        console.error('Error fetching news:', error);
        setError(error.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filterType]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <SEO title="AI 资讯 - 优尼克斯教育" description="关注人工智能前沿动态与学员精彩案例" />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight">AI 行业资讯</h1>
          <p className="text-lg text-muted-foreground mb-8 font-light">精选全球 AI 前沿动态，助你保持技术敏锐度</p>
          
          {/* Carousel - 独立显示，不受列表 loading 状态影响 */}
          {featuredArticles.length > 0 && (
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
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 transform scale-105' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
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
               <div key={i} className="bg-muted rounded-2xl h-64 animate-pulse break-inside-avoid" />
             ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">内容加载失败</h3>
            <p className="text-muted-foreground mb-6 max-w-md text-center">{error === '请求超时' ? '网络连接较慢，请稍后重试' : '获取资讯列表时遇到问题'}</p>
            <Button onClick={() => setFilterType(prev => prev)} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              重新加载
            </Button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-dashed border-border">
            <Inbox className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">暂无相关资讯</p>
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
