
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Calendar, ArrowRight, Eye, AlertCircle, RefreshCw, Inbox } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  schedule_time: string;
  cover_image: string;
}

interface Article {
  id: string;
  title: string;
  created_at: string;
  cover_image: string;
  type: 'original' | 'external';
}

export function FeaturedContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch latest 3 published courses
      const coursesPromise = supabase
        .from('courses')
        .select('id, title, schedule_time, cover_image')
        .eq('status', 'published')
        .order('schedule_time', { ascending: false }) // Show latest
        .limit(3);

      // Fetch latest 3 published articles
      const articlesPromise = supabase
        .from('articles')
        .select('id, title, created_at, cover_image, type')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      const [coursesResult, articlesResult] = await Promise.all([coursesPromise, articlesPromise]);

      if (coursesResult.error) throw coursesResult.error;
      if (articlesResult.error) throw articlesResult.error;

      setCourses(coursesResult.data || []);
      setArticles(articlesResult.data || []);
    } catch (error: any) {
      console.error('Error fetching featured content:', error);
      setError(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Skeleton for Courses */}
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-5 p-2 -m-2">
                    <div className="w-32 h-20 bg-muted rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skeleton for News */}
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-5 p-2 -m-2">
                    <div className="w-32 h-20 bg-muted rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">内容加载失败</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error === '请求超时' ? '网络连接较慢，请稍后重试' : '获取最新课程和资讯时遇到问题'}</p>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重新加载
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Latest Courses Column */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">最新直播课</h2>
              <Link to="/weekly-class" className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center group">
                查看全部 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {courses.length > 0 ? (
              <div className="space-y-6">
                {courses.map(course => (
                  <Link key={course.id} to={`/courses/${course.id}`} className="flex gap-5 group p-2 -m-2 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border">
                      <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(course.schedule_time).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Inbox className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">暂无发布的课程</p>
              </div>
            )}
          </div>

          {/* Latest News Column */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">最新资讯</h2>
              <Link to="/news" className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center group">
                阅读更多 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map(article => (
                  <Link key={article.id} to={`/news/${article.id}`} className="flex gap-5 group p-2 -m-2 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border">
                       <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        {article.type === 'external' && (
                          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-medium">导读</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Inbox className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">暂无发布的资讯</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
