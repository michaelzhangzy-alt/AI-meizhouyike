import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
}

export function Hero({ onRegister }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
          <span className="block text-foreground">AI 时代</span>
          <span className="block text-blue-600 mt-2">大学生必备的实战技能</span>
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-4 text-lg text-muted-foreground sm:text-xl mb-10">
          <p>每周一节公开课，大厂专家手把手教学。</p>
          <p>掌握 ChatGPT、DeepSeek、AI 编程、智能体开发等核心技能，提升职场竞争力。</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/weekly-class">
            <Button size="lg" className="text-lg px-8 w-full sm:w-auto h-12">
              <PlayCircle className="w-5 h-5 mr-2" />
              查看本周直播课
            </Button>
          </Link>
          <Link to="/news">
            <Button size="lg" variant="outline" className="text-lg px-8 w-full sm:w-auto h-12">
              查看 AI 资讯 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
