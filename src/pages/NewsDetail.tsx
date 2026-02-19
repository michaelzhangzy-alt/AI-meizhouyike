
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';
import { Calendar, Eye, ArrowLeft, ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';
import { SEO } from '../components/SEO';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  created_at: string;
  views: number;
  type: 'original' | 'external';
  external_url?: string;
  external_guide?: string;
}
interface ArticleListItem {
  id: string;
  title: string;
  created_at: string;
}

interface ArticleNavItem {
  id: string;
  title: string;
}

export default function NewsDetail() {
  const { id } = useParams();
  const { handleRegister } = usePublicLayoutContext();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<ArticleListItem[]>([]);
  const [prevNext, setPrevNext] = useState<{ prev: ArticleNavItem | null; next: ArticleNavItem | null }>(
    { prev: null, next: null }
  );

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Increment views
        await supabase.rpc('increment_article_views', { article_id: id });

        // Fetch current article
        const { data: current, error } = await supabase
          .from('articles')
          .select('id, title, summary, content, cover_image, created_at, views, type, external_url, external_guide')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArticle(current);

        // Fetch recent articles (for sidebar list)
        const { data: recent } = await supabase
          .from('articles')
          .select('id, title, created_at')
          .eq('status', 'published')
          .neq('id', id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        setRecentArticles(recent || []);

        // Fetch Prev/Next articles
        // Next: created_at > current.created_at (newer)
        // Prev: created_at < current.created_at (older)
        const { data: next } = await supabase
          .from('articles')
          .select('id, title')
          .eq('status', 'published')
          .gt('created_at', current.created_at)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        const { data: prev } = await supabase
          .from('articles')
          .select('id, title')
          .eq('status', 'published')
          .lt('created_at', current.created_at)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        setPrevNext({
          prev: prev || null,
          next: next || null
        });

      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground transition-colors duration-300">加载中...</div>;
  if (!article) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground transition-colors duration-300">文章不存在</div>;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <SEO 
        title={article.title} 
        description={article.summary} 
        image={article.cover_image}
        type="article"
      />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <Link to="/news" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回资讯列表
            </Link>

            <article className="bg-card rounded-xl p-0 lg:p-0">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{article.title}</h1>
              
              <div className="flex items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {article.views || 0} 阅读
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
                 {article.type === 'external' ? (
                   <div className="bg-muted border border-border rounded-xl p-8">
                     <div className="mb-6">
                       <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                         <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                         导读指南
                       </h3>
                       <div 
                         className="rich-text-content text-muted-foreground"
                         dangerouslySetInnerHTML={{ 
                           __html: DOMPurify.sanitize(article.external_guide || article.summary) 
                         }} 
                       />
                     </div>
                     
                     <div className="flex justify-center pt-6 border-t border-border">
                       <a 
                         href={article.external_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors shadow-sm"
                       >
                         阅读原文
                         <ExternalLink className="w-5 h-5 ml-2" />
                       </a>
                     </div>
                     <p className="text-center text-xs text-muted-foreground/60 mt-4">
                       点击将跳转至第三方网站阅读
                     </p>
                   </div>
                 ) : (
                   <div 
                     className="rich-text-content"
                     dangerouslySetInnerHTML={{ 
                       __html: DOMPurify.sanitize(article.content, {
                         ADD_TAGS: ['iframe', 'img', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'pre', 'code', 'a', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'sub', 'sup', 'font'],
                         ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height', 'style', 'class', 'id', 'data-page-id', 'data-id', 'align', 'color', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'target', 'href', 'title', 'alt'],
                         WHOLE_DOCUMENT: false,
                       }) 
                     }} 
                   />
                 )}
              </div>
            </article>

            {/* Prev/Next Navigation */}
            <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevNext.prev ? (
                <Link 
                  to={`/news/${prevNext.prev.id}`}
                  className="group flex flex-col p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground mb-1 group-hover:text-primary">上一篇</span>
                  <span className="font-medium text-foreground line-clamp-1 group-hover:text-primary">
                    {prevNext.prev.title}
                  </span>
                </Link>
              ) : (
                <div className="p-4 border border-border rounded-lg bg-muted/50 text-muted-foreground">
                  <span className="text-sm">上一篇</span>
                  <div className="font-medium">没有了</div>
                </div>
              )}

              {prevNext.next ? (
                <Link 
                  to={`/news/${prevNext.next.id}`}
                  className="group flex flex-col items-end text-right p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground mb-1 group-hover:text-primary">下一篇</span>
                  <span className="font-medium text-foreground line-clamp-1 group-hover:text-primary">
                    {prevNext.next.title}
                  </span>
                </Link>
              ) : (
                <div className="p-4 border border-border rounded-lg bg-muted/50 text-muted-foreground text-right">
                  <span className="text-sm">下一篇</span>
                  <div className="font-medium">没有了</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">最新资讯</h3>
              <ul className="space-y-4">
                {recentArticles.length > 0 ? (
                  recentArticles.map(item => (
                    <li key={item.id}>
                      <Link 
                        to={`/news/${item.id}`}
                        className="group block"
                      >
                        <h4 className="text-sm font-medium text-muted-foreground group-hover:text-primary line-clamp-2 leading-relaxed">
                          {item.title}
                        </h4>
                        <span className="text-xs text-muted-foreground/60 mt-1 block">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">暂无其他资讯</li>
                )}
              </ul>
            </div>
            
            {/* Ad / CTA Placeholder */}
            <div className="bg-primary rounded-xl p-6 text-primary-foreground text-center">
              <h3 className="font-bold text-lg mb-2">每周一课</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">加入我们，探索AI无限可能</p>
              <button 
                onClick={() => handleRegister('news_sidebar')}
                className="bg-background text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-background/90 w-full"
              >
                立即报名
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
