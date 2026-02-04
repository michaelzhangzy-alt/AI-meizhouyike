
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Calendar, ArrowRight, Eye } from 'lucide-react';

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch latest 3 published courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title, schedule_time, cover_image')
        .eq('status', 'published')
        .order('schedule_time', { ascending: false }) // Show latest
        .limit(3);

      // Fetch latest 3 published articles
      const { data: articlesData } = await supabase
        .from('articles')
        .select('id, title, created_at, cover_image, type')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      setCourses(coursesData || []);
      setArticles(articlesData || []);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

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
          </div>

          {/* Latest News Column */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">最新资讯</h2>
              <Link to="/news" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center group">
                阅读更多 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
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
          </div>

        </div>
      </div>
    </section>
  );
}
