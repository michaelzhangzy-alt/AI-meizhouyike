
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
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Latest Courses Column */}
          <div className="md:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">最新直播课</h2>
              <Link to="/weekly-class" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                查看更多 <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-6">
              {courses.map(course => (
                <Link key={course.id} to={`/courses/${course.id}`} className="flex gap-4 group">
                  <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(course.schedule_time).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest News Column */}
          <div className="md:w-1/2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">最新资讯</h2>
              <Link to="/news" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                查看更多 <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-6">
              {articles.map(article => (
                <Link key={article.id} to={`/news/${article.id}`} className="flex gap-4 group">
                  <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                     <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      {article.type === 'external' && (
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">导读</span>
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
