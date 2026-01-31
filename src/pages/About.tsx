
import React, { useState, useEffect } from 'react';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { HistoryTimeline } from '../components/about/HistoryTimeline';
import { supabase } from '../lib/supabase';
import DOMPurify from 'dompurify';
import { SEO } from '../components/SEO';

const About = () => {
  const { handleRegister } = usePublicLayoutContext();
  const [loading, setLoading] = useState(true);
  const [aboutContent, setAboutContent] = useState('');
  const [memberBenefits, setMemberBenefits] = useState<any[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_fragments')
        .select('*')
        .in('slug', ['about_us', 'member_benefits']);

      if (error) throw error;

      const about = data?.find(item => item.slug === 'about_us');
      const benefits = data?.find(item => item.slug === 'member_benefits');

      if (about) {
        setAboutContent(about.content);
      }
      
      if (benefits && Array.isArray(benefits.content)) {
        setMemberBenefits(benefits.content);
      } else {
        // Fallback defaults if DB is empty or format is wrong
        setMemberBenefits([
           { title: "全年 52 节 AI 实战直播课" },
           { title: "专属社群答疑与作业点评" },
           { title: "一线大厂内推机会" },
           { title: "定期线下交流会" },
           { title: "从0到1项目实操辅导" }
        ]);
      }

    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SEO title="关于我们" description="赋能每一位在校大学生，连接校园与职场的最后一公里。" />
      
      <main className="flex-1 relative z-10">
        <div className="container py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">关于我们</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">赋能每一位在校大学生，连接校园与职场的最后一公里。</p>
          </div>

          {/* Intro Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
            <div>
              <h2 className="text-3xl font-bold mb-6">我们的初心</h2>
              {loading ? (
                <div className="space-y-4">
                   <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                   <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                   <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ) : (
                <div 
                  className="prose prose-lg text-muted-foreground leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aboutContent) }}
                />
              )}
            </div>
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden group">
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                 <div className="w-2 h-8 bg-blue-600 rounded-full" />
                 会员权益
               </h3>
               {loading ? (
                  <div className="space-y-4">
                     {[1,2,3,4].map(i => <div key={i} className="h-6 bg-gray-100 rounded w-3/4 animate-pulse"></div>)}
                  </div>
               ) : (
                 <ul className="space-y-4 relative z-10">
                   {memberBenefits.map((item, idx) => (
                     <li key={idx} className="flex items-start text-lg group/item">
                       <span className="h-2 w-2 bg-blue-600 rounded-full mr-3 mt-2.5 shrink-0 transition-transform group-hover/item:scale-125" />
                       <div>
                         <span className="font-medium text-gray-800 group-hover/item:text-blue-600 transition-colors">{item.title}</span>
                         {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
               <Button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm" size="lg" onClick={() => handleRegister('about_benefits')}>加入会员（咨询助教）</Button>
            </div>
          </div>

          {/* Development History Timeline */}
          <div className="mb-24 -mx-4 md:-mx-8 lg:-mx-12">
            <HistoryTimeline />
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">联系我们</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-none shadow-sm bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">地址</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">长春市北湖科技开发区北远达大街3000号</p>
                </CardContent>
              </Card>
              <Card className="text-center border-none shadow-sm bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">电话</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">18943996408</p>
                </CardContent>
              </Card>
              <Card className="text-center border-none shadow-sm bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">邮箱</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">312150036@qq.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
