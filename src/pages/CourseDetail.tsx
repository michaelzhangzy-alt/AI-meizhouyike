
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Calendar, MapPin, Users, Clock, Share2, CheckCircle, ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  cover_image: string;
  instructor: string;
  schedule_time: string;
  location: string;
}

export default function CourseDetail() {
  const { id } = useParams();
  const { handleRegister } = usePublicLayoutContext();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  // If no ID is provided (e.g. /weekly-class route), we fetch the next upcoming course
  const isWeeklyClass = !id;

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('courses').select('*').eq('status', 'published');

      if (id) {
        // Fetch specific course
        const { data, error } = await query.eq('id', id).single();
        if (error) throw error;
        setCourse(data);
      } else {
        // Fetch next upcoming course for "Weekly Class" page
        const { data, error } = await query
          .gte('schedule_time', new Date().toISOString())
          .order('schedule_time', { ascending: true })
          .limit(1)
          .single();
          
        if (error) {
            // If no future course, maybe show the latest one or handle gracefully
            console.log("No upcoming course found");
        }
        setCourse(data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHighlights = (content: string) => {
    if (!content) return [];
    return content
      .split('\n')
      .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
      .map(line => line.replace(/^[-*]\s+/, ''))
      .slice(0, 6); // Show up to 6 highlights
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isWeeklyClass ? '本周暂无直播课安排' : '课程不存在'}
          </h2>
          <p className="text-gray-500 mb-8">
            {isWeeklyClass ? '请关注后续通知，或浏览往期精彩回顾。' : '您访问的课程可能已被删除或下架。'}
          </p>
          <div className="flex gap-4">
             <Link to="/">
              <Button variant="outline">返回首页</Button>
            </Link>
            <Link to="/courses">
              <Button>浏览往期课程</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const highlights = getHighlights(course.content);
  const isPast = new Date(course.schedule_time) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`${course.title} - 优尼克斯教育`}
        description={course.description}
        image={course.cover_image}
      />

      <main className="pb-16">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Cover Image */}
              <div className="w-full md:w-1/3 lg:w-2/5">
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100 relative">
                  <img 
                    src={course.cover_image || "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20AI%20education%20course%20cover&image_size=landscape_16_9"} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {isWeeklyClass && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      本周直播
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col h-full">
                <div className="mb-auto">
                    {!isWeeklyClass && (
                         <Link to="/courses" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                           <ArrowLeft className="w-4 h-4 mr-1" />
                           返回课程列表
                         </Link>
                    )}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {course.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="text-xs text-gray-500 block">上课时间</span>
                        <span className="font-medium">
                          {new Date(course.schedule_time).toLocaleDateString()}
                          {' '}
                          {new Date(course.schedule_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="text-xs text-gray-500 block">上课地点</span>
                        <span className="font-medium">{course.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="text-xs text-gray-500 block">主讲导师</span>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="text-xs text-gray-500 block">课程状态</span>
                        <span className={`font-medium ${isPast ? 'text-gray-500' : 'text-green-600'}`}>
                          {isPast ? '已结束' : '报名中'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6"
                    onClick={() => handleRegister(isWeeklyClass ? 'weekly_class_hero' : 'course_detail_hero', course.title)}
                    disabled={isPast}
                  >
                    {isPast ? '查看回放 (联系助教)' : '立即免费报名'}
                  </Button>
                  {/* Share Button Placeholder - could use Web Share API */}
                  <Button variant="outline" size="lg" className="w-full sm:w-auto py-6" onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: course.title,
                              text: course.description,
                              url: window.location.href
                          }).catch(console.error);
                      } else {
                          alert("请复制链接分享给好友");
                      }
                  }}>
                    <Share2 className="w-5 h-5 mr-2" />
                    分享给好友
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 space-y-12">
                
               {/* Highlights */}
               {highlights.length > 0 && (
                <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-1 h-8 bg-blue-600 rounded-full mr-3"></span>
                    课程亮点
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Detailed Content */}
              <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                   <span className="w-1 h-8 bg-blue-600 rounded-full mr-3"></span>
                   课程详情
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 rich-text-content"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(course.content) 
                  }} 
                />
              </section>

              {/* FAQ Placeholder */}
              <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                   <span className="w-1 h-8 bg-blue-600 rounded-full mr-3"></span>
                   常见问题
                </h2>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">如何观看直播？</h4>
                        <p className="text-gray-600">报名成功后，助教老师会邀请您加入专属学习群，直播链接将在群内发布。</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">课程有回放吗？</h4>
                        <p className="text-gray-600">直播结束后会提供回放视频，您可以随时通过本网站的“往期课程”栏目查看。</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">零基础可以学习吗？</h4>
                        <p className="text-gray-600">我们的公开课主要面向大学生和初学者，内容通俗易懂，非常适合零基础同学入门。</p>
                    </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-8">
              <div className="bg-blue-600 rounded-xl p-8 text-white text-center shadow-lg">
                <h3 className="font-bold text-xl mb-2">加入学习社群</h3>
                <p className="text-blue-100 mb-6">获取课件、源码，结识更多 AI 爱好者</p>
                <Button 
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none"
                    onClick={() => handleRegister('course_detail_sidebar', course.title)}
                >
                    立即入群
                </Button>
              </div>

               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4">讲师介绍</h3>
                  <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                          {course.instructor[0]}
                      </div>
                      <div className="ml-3">
                          <div className="font-bold text-gray-900">{course.instructor}</div>
                          <div className="text-xs text-gray-500">资深 AI 讲师</div>
                      </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                      拥有多年大厂开发经验，专注于 AI 技术落地与实战教学。
                  </p>
               </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}