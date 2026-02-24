
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Calendar, Newspaper, ArrowRight } from 'lucide-react';

export function QuickEntry() {
  return (
    <section className="py-16 bg-muted/30 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weekly Class Card */}
          <Link to="/weekly-class" className="group minimal-card p-8 md:p-10 relative overflow-hidden bg-card border border-border rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            {/* Hot Tag */}
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10 animate-pulse">
              🔥 火热报名中
            </div>
            
            <div className="flex items-start space-x-6 relative z-10">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">本周直播课</h3>
                <p className="text-muted-foreground mb-6 font-normal">每周一节实战课，紧跟 AI 技术最前沿</p>
                <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>立即查看</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* AI News Card */}
          <Link to="/news" className="group minimal-card p-8 md:p-10 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-foreground/30 transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-muted text-muted-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <Newspaper className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-foreground transition-colors">AI 行业资讯</h3>
                <p className="text-muted-foreground mb-6 font-normal">精选行业动态与干货，洞察未来趋势</p>
                <div className="flex items-center text-foreground font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>阅读更多</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
