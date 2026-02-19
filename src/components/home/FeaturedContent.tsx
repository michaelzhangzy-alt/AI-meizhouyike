
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Skeleton for Courses */}
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-32 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-5 p-2 -m-2">
                    <div className="w-32 h-20 bg-slate-100 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skeleton for News */}
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-32 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-5 p-2 -m-2">
                    <div className="w-32 h-20 bg-slate-100 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse"></div>
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">内容加载失败</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">{error === '请求超时' ? '网络连接较慢，请稍后重试' : '获取最新课程和资讯时遇到问题'}</p>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重新加载
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Latest Courses Column */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">最新直播课</h2>
              <Link to="/weekly-class" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center group">
                查看全部 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {courses.length > 0 ? (
              <div className="space-y-6">
                {courses.map(course => (
                  <Link key={course.id} to={`/courses/${course.id}`} className="flex gap-5 group p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                      <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(course.schedule_time).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">暂无发布的课程</p>
              </div>
            )}
          </div>

          {/* Latest News Column */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">最新资讯</h2>
              <Link to="/news" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center group">
                阅读更多 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map(article => (
                  <Link key={article.id} to={`/news/${article.id}`} className="flex gap-5 group p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                       <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 gap-4">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        {article.type === 'external' && (
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium">导读</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">暂无发布的资讯</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
