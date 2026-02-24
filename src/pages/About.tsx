
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
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <SEO title="关于我们" description="赋能每一位在校大学生，连接校园与职场的最后一公里。" />
      
      <main className="flex-1">
        {/* Header / Hero */}
        <div className="bg-muted border-b border-border">
          <div className="container py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-8">
              关于我们 <span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              致力于赋能每一位在校大学生，<span className="text-foreground font-medium">连接校园与职场的最后一公里</span>。
            </p>
          </div>
        </div>

        <div className="container py-20">
          {/* Intro Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                我们的初心
              </h2>
              {loading ? (
                <div className="space-y-4">
                   <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                   <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                   <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                </div>
              ) : (
                <div 
                  className="rich-text-content text-lg text-foreground leading-loose"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aboutContent) }}
                />
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="bg-card rounded-3xl p-10 border border-border shadow-xl shadow-muted/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
                
                <h3 className="text-2xl font-bold mb-8 text-foreground">
                  会员权益
                </h3>
                {loading ? (
                  <div className="space-y-4">
                     {[1,2,3,4,5].map(i => <div key={i} className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>)}
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {memberBenefits.map((item, idx) => (
                      <li key={idx} className="flex items-start group">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <span className="text-xs font-bold">{idx + 1}</span>
                        </div>
                        <div>
                          <span className="font-bold text-foreground text-lg">{item.title}</span>
                          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button 
                  className="mt-10 w-full primary-button py-4 text-lg shadow-lg shadow-primary/20"
                  onClick={() => handleRegister('about_benefits')}
                >
                  加入会员（咨询助教）
                </button>
              </div>
            </div>
          </div>

          {/* Development History Timeline */}
          <div className="mb-32">
            <HistoryTimeline />
          </div>

          {/* Contact Section */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">联系我们</h2>
              <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: '办公地址', content: '长春市北湖科技开发区北远达大街3000号' },
                { icon: Phone, title: '联系电话', content: '18943996408' },
                { icon: Mail, title: '电子邮箱', content: '312150036@qq.com' }
              ].map((item, i) => (
                <div key={i} className="text-center p-8 rounded-2xl border border-border bg-muted/50 hover:bg-card hover:shadow-xl hover:shadow-muted transition-all duration-300">
                  <div className="w-14 h-14 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
