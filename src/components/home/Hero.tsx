import React from 'react';
import { Button } from '../ui/button';

interface HeroProps {
  onRegister: () => void;
}

export function Hero({ onRegister }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block text-foreground">AI 时代</span>
          <span className="block text-primary mt-2">大学生必备的实战技能</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">每周一节公开课，大厂专家手把手教学。掌握ChatGPT | DeepSeek、AI编程、AI智能体、AI绘画、自动化办公等核心技能，提升职场竞争力。技能，提升职场竞争力。技能，提升职场竞争力。</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={onRegister} className="text-lg px-8">
            立即报名本周直播课
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => document.getElementById('open-class')?.scrollIntoView({ behavior: 'smooth' })}>
            了解课程详情
          </Button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
