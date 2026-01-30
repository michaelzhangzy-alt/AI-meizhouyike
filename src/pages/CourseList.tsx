
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Users, PlayCircle } from 'lucide-react';

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch all published courses, ordered by date descending (newest first)
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, cover_image, instructor, schedule_time, location')
        .eq('status', 'published')
        .order('schedule_time', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <SEO title="往期课程回放 - 优尼克斯教育" description="浏览优尼克斯教育往期精彩AI公开课回放与资料" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">往期精彩课程</h1>
          <p className="text-xl text-gray-600">错过直播不要紧，回放内容同样精彩</p>
        </div>

        {loading ? (
          <div className="text-center py-24">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
             <p className="mt-4 text-gray-500">加载中...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 text-gray-500 bg-white rounded-xl shadow-sm">
            暂无课程记录
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
               const isPast = new Date(course.schedule_time) < new Date();
               return (
                <Link key={course.id} to={`/courses/${course.id}`} className="group h-full">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col border-gray-100 group-hover:border-blue-100">
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img 
                        src={course.cover_image || "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=AI%20Course%20Education%20Tech&image_size=landscape_16_9"} 
                        alt={course.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            {isPast && (
                                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    <PlayCircle className="w-8 h-8 text-blue-600" />
                                </div>
                            )}
                        </div>
                        <div className="absolute top-3 right-3">
                             <span className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${
                                 isPast ? 'bg-gray-800/80 text-white' : 'bg-green-500 text-white'
                             }`}>
                                 {isPast ? '回放' : '直播'}
                             </span>
                        </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
                            <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(course.schedule_time).toLocaleDateString()}
                            </span>
                            <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                                <Users className="w-3 h-3 mr-1" />
                                {course.instructor}
                            </span>
                        </div>
                        <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {course.description}
                        </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        查看详情 →
                    </CardFooter>
                    </Card>
                </Link>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}