import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
}

export function Hero({ onRegister }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-28 bg-white">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-subtle-grid [mask-image:radial-gradient(ellipse_at_center,white,transparent)] -z-10" />
      
      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-semibold text-blue-700 tracking-wide">本周直播课程已发布</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl mb-8 text-slate-900">
          <span className="block mb-2">AI 时代</span>
          <span className="block text-blue-600">重新定义你的核心竞争力</span>
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-4 text-lg text-slate-500 sm:text-xl mb-10 font-normal leading-relaxed">
          <p className="font-medium text-slate-700">从校园到职场，掌握未来 5 年的通用语言。</p>
          <p>每周一节实战场景课，把 AI 变成你的超级助手。</p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in-up">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}&backgroundColor=c0aede`}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
              +1k
            </div>
          </div>
          <div className="text-sm text-slate-600 text-left">
            <div className="flex items-center gap-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-bold text-slate-900">1,203 位同学</span>
            </div>
            <p className="text-slate-500 text-xs">本周已报名学习</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/weekly-class">
            <button className="primary-button text-lg px-10 h-14">
              <PlayCircle className="w-5 h-5 mr-2" />
              查看本周直播课
            </button>
          </Link>
          <Link to="/news">
            <button className="secondary-button text-lg px-10 h-14">
              查看 AI 资讯 <ArrowRight className="w-4 h-4 ml-2 text-slate-400" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
