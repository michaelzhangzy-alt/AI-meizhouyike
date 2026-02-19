
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  instructor: string;
  schedule_time: string;
  location: string;
  status: string;
}

export default function WeeklyClass() {
  const { handleRegister } = usePublicLayoutContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('schedule_time', { ascending: true }); // Ascending to show nearest future first

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group courses by week or status?
  // For MVP, let's separate into "Upcoming" and "Past" (Recent)
  const now = new Date();
  const upcomingCourses = courses.filter(c => new Date(c.schedule_time) >= now);
  const pastCourses = courses.filter(c => new Date(c.schedule_time) < now).reverse(); // Show most recent past first

  const CourseCard = ({ course, isPast }: { course: Course; isPast: boolean }) => (
    <div className={`bg-card rounded-xl border border-border overflow-hidden flex flex-col md:flex-row ${isPast ? 'opacity-80' : 'shadow-sm hover:shadow-md'} transition-all`}>
      <div className="md:w-1/3 h-48 md:h-auto relative">
        <img 
          src={course.cover_image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        {isPast && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold border-2 border-white px-4 py-1 rounded">已结束</span>
          </div>
        )}
      </div>
      <div className="p-6 md:w-2/3 flex flex-col">
        <div className="flex items-center text-sm text-muted-foreground mb-2 gap-4">
          <div className="flex items-center">
             <Calendar className="w-4 h-4 mr-1 text-primary" />
             {new Date(course.schedule_time).toLocaleDateString()} {new Date(course.schedule_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div className="flex items-center">
             <Users className="w-4 h-4 mr-1 text-primary" />
             {course.instructor}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{course.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
           <div className="flex items-center text-sm text-muted-foreground">
             <MapPin className="w-4 h-4 mr-1" />
             {course.location}
           </div>
           <div className="flex gap-3">
             <Link to={`/courses/${course.id}`}>
               <Button variant="outline" size="sm">查看详情</Button>
             </Link>
             {!isPast && (
               <Button size="sm" onClick={() => handleRegister('weekly_list', course.title)}>
                 立即报名
               </Button>
             )}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <SEO title="本周直播课 - 优尼克斯教育" description="查看本周最新的AI直播课程安排" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">本周直播课</h1>
          <p className="text-xl text-muted-foreground">每周一节实战课，跟上 AI 时代步伐</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">加载中...</div>
        ) : (
          <div className="space-y-12 max-w-4xl mx-auto">
            {/* Upcoming Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <span className="w-2 h-8 bg-primary rounded-full mr-3"></span>
                即将开始
              </h2>
              {upcomingCourses.length > 0 ? (
                <div className="space-y-6">
                  {upcomingCourses.map(course => (
                    <CourseCard key={course.id} course={course} isPast={false} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl p-8 text-center border border-dashed border-border">
                  <p className="text-muted-foreground mb-4">本周暂无直播安排，敬请期待</p>
                  <Link to="/news">
                    <Button variant="outline">浏览 AI 资讯</Button>
                  </Link>
                </div>
              )}
            </section>

            {/* Past Section */}
            {pastCourses.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <span className="w-2 h-8 bg-muted rounded-full mr-3"></span>
                  往期回顾
                </h2>
                <div className="space-y-6">
                  {pastCourses.map(course => (
                    <CourseCard key={course.id} course={course} isPast={true} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                   <Link to="/courses">
                      <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                        查看更多往期课程 <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                   </Link>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
