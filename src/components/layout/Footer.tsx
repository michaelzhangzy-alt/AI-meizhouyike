import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Footer() {
  const location = useLocation();

  const handleScrollTop = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border bg-muted transition-colors duration-300">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">优尼克斯教育</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              致力于为在校大学生提供最前沿的 AI 技术实战课程，
              助力每一位开发者在智能时代实现职业跃迁。
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <h4 className="text-sm font-semibold text-foreground mb-6">导航中心</h4>
            <nav className="flex flex-col space-y-3 text-sm md:text-right">
              {[
                { name: '首页', path: '/' },
                { name: '关于我们', path: '/about' },
                { name: '本周直播课', path: '/weekly-class' },
                { name: '往期回看', path: '/courses' }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={cn(
                    "transition-colors duration-200",
                    location.pathname === item.path 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                  onClick={() => handleScrollTop(item.path)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} 优尼克斯教育 (UNIXTECH). 版权所有.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground transition-colors cursor-default">服务状态: 正常运行</span>
            <span className="opacity-60">Version 1.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
