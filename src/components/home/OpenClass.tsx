
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';

interface OpenClassProps {
  onRegister: (courseName: string) => void;
}

interface Course {
  id: string;
  title: string;
  schedule_time: string;
  location: string;
  description: string; // Used for upcoming list description
  content: string; // Used for highlights parsing (if needed)
  cover_image: string;
  instructor: string;
}

export function OpenClass({ onRegister }: OpenClassProps) {
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null);
  const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .gte('schedule_time', new Date().toISOString()) // Only future courses
        .order('schedule_time', { ascending: true })
        .limit(4);

      if (error) throw error;

      if (data && data.length > 0) {
        setFeaturedCourse(data[0]);
        setUpcomingCourses(data.slice(1));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse highlights from content (assuming markdown list)
  const getHighlights = (content: string) => {
    if (!content) return [];
    // Simple extraction of bullet points
    return content
      .split('\n')
      .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
      .map(line => line.replace(/^[-*]\s+/, ''))
      .slice(0, 4);
  };

  if (loading) return <div className="py-24 text-center">正在加载课程信息...</div>;

  // Fallback if no courses
  if (!featuredCourse) {
    return (
      <section id="open-class" className="py-16 md:py-24 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">本周公开课</h2>
          <p className="text-muted-foreground">近期暂无公开课安排，敬请期待。</p>
        </div>
      </section>
    );
  }

  const highlights = getHighlights(featuredCourse.content);

  return (
    <section id="open-class" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">本周直播课</h2>
          <p className="text-lg text-muted-foreground">精选实战内容，每周更新，带你领略AI魅力</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Course */}
          <Card className="lg:col-span-2 overflow-hidden border-primary/20 shadow-lg flex flex-col">
            <div className="aspect-video w-full relative overflow-hidden bg-muted">
               <img 
                 src={featuredCourse.cover_image || "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20classroom%20education%20AI%20technology&image_size=landscape_16_9"} 
                 alt={featuredCourse.title} 
                 className="object-cover w-full h-full transition-transform hover:scale-105 duration-700"
               />
               <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                 本周主推
               </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">{featuredCourse.title}</CardTitle>
              <CardDescription className="text-base mt-2 flex flex-col sm:flex-row sm:gap-4 gap-2">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> 
                  {new Date(featuredCourse.schedule_time).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {featuredCourse.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="w-5 h-5 mr-2 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">讲师：</span>
                    <span className="text-muted-foreground">{featuredCourse.instructor}</span>
                  </div>
                </div>
                {highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">课程亮点：</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!highlights.length && (
                   <p className="text-muted-foreground">{featuredCourse.description}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full sm:w-auto" onClick={() => onRegister(featuredCourse.title)}>
                立即免费报名
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">近期预告</h3>
            </div>
            {upcomingCourses.map((course, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" /> 
                    {new Date(course.schedule_time).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onRegister(course.title)}>
                    预约提醒
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {upcomingCourses.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                暂无更多预告
              </div>
            )}

            <div className="p-6 bg-primary/5 rounded-lg border border-primary/10 text-center">
              <h4 className="font-medium mb-2">想学习其他内容？</h4>
              <p className="text-sm text-muted-foreground mb-4">加入我们的社群，告诉我们你想学什么</p>
              <Button variant="secondary" size="sm" onClick={() => onRegister("社群咨询")}>
                联系助教
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
