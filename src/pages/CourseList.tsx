
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';
import { SEO } from '../components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Users, MapPin, PlayCircle, AlertCircle, RefreshCw, Inbox } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  instructor: string;
  schedule_time: string;
  location: string;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all published courses, ordered by date descending (newest first)
      const query = supabase
        .from('courses')
        .select('id, title, description, cover_image, instructor, schedule_time, location')
        .eq('status', 'published')
        .order('schedule_time', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <SEO title="往期课程回放 - 优尼克斯教育" description="浏览优尼克斯教育往期精彩AI公开课回放与资料" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">往期精彩课程</h1>
          <p className="text-xl text-muted-foreground">错过直播不要紧，回放内容同样精彩</p>
        </div>

        {loading ? (
          <div className="text-center py-24">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
             <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">课程加载失败</h3>
            <p className="text-muted-foreground mb-6 max-w-md text-center">{error === '请求超时' ? '网络连接较慢，请稍后重试' : '获取课程列表时遇到问题'}</p>
            <Button onClick={fetchCourses} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              重新加载
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card rounded-xl shadow-sm border border-border">
            <Inbox className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">暂无课程记录</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
               const isPast = new Date(course.schedule_time) < new Date();
               // 随机生成占位图，避免 text_to_image 调用
               const placeholderImage = `https://api.dicebear.com/7.x/shapes/svg?seed=${course.id}&backgroundColor=1a1a1a`;

               return (
                <Link key={course.id} to={`/courses/${course.id}`} className="group h-full block">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col border-border group-hover:border-primary/50 bg-card text-card-foreground">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                        <img 
                        src={course.cover_image || placeholderImage} 
                        alt={course.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            {isPast && (
                                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    <PlayCircle className="w-8 h-8 text-primary" />
                                </div>
                            )}
                        </div>
                        <div className="absolute top-3 right-3">
                             <span className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${
                                 isPast ? 'bg-black/60 text-white backdrop-blur-sm' : 'bg-green-500 text-white'
                             }`}>
                                 {isPast ? '回放' : '直播'}
                             </span>
                        </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                        <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-2">
                            <span className="flex items-center bg-muted px-2 py-1 rounded">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(course.schedule_time).toLocaleDateString()}
                            </span>
                            <span className="flex items-center bg-muted px-2 py-1 rounded">
                                <Users className="w-3 h-3 mr-1" />
                                {course.instructor}
                            </span>
                        </div>
                        <CardTitle className="text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                            {course.title}
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {course.description}
                        </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        查看详情 →
                    </CardFooter>
                    </Card>
                </Link>
               );
            })}
          </div>
        )}
      </main>
    </div>
  );
}