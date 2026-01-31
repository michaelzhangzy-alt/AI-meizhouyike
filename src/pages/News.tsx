
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';
import { Card } from '../components/ui/card';
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';

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
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'original' | 'external'>('all');

  useEffect(() => {
    fetchArticles();
  }, [filterType]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="AI 资讯 - 优尼克斯教育" description="关注人工智能前沿动态与学员精彩案例" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI 行业资讯</h1>
          <p className="text-xl text-gray-600 mb-8">关注人工智能前沿动态与学员精彩案例</p>
          
          {/* Filter Tabs */}
          <div className="flex justify-center gap-2">
            <Button 
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className="rounded-full"
            >
              全部
            </Button>
            <Button 
              variant={filterType === 'original' ? 'default' : 'outline'}
              onClick={() => setFilterType('original')}
              className="rounded-full"
            >
              原创干货
            </Button>
            <Button 
              variant={filterType === 'external' ? 'default' : 'outline'}
              onClick={() => setFilterType('external')}
              className="rounded-full"
            >
              外链导读
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                {article.cover_image && (
                  <div className="relative">
                    <img 
                      src={article.cover_image} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    {article.type === 'external' && (
                       <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
                         <ExternalLink className="w-3 h-3 mr-1" /> 导读
                       </div>
                    )}
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    {article.summary}
                  </p>
                  
                  {article.type === 'external' ? (
                    <Link 
                      to={`/news/${article.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-auto"
                    >
                      查看导读 <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    <Link 
                      to={`/news/${article.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-auto"
                    >
                      阅读更多 <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
