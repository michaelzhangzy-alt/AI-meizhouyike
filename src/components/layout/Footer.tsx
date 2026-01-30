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
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">优尼克斯教育</h3>
            <p className="text-sm text-muted-foreground max-w-sm">致力于为在校大学生提供最前沿的AI技术实战课程，助力职业成长。</p>
          </div>
          <div className="flex flex-col md:items-end space-y-2">
            <h4 className="font-medium">快速链接</h4>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground md:text-right">
              <Link 
                to="/" 
                className={cn(
                  "transition-colors hover:text-primary",
                  location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
                )}
                onClick={() => handleScrollTop('/')}
              >
                首页
              </Link>
              <Link 
                to="/about" 
                className={cn(
                  "transition-colors hover:text-primary",
                  location.pathname === "/about" ? "text-primary font-medium" : "text-muted-foreground"
                )}
                onClick={() => handleScrollTop('/about')}
              >
                关于我们
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2">
            <span>© {new Date().getFullYear()} 优尼克斯教育. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span className="text-xs opacity-60 hover:opacity-100 transition-opacity" title="2025-01-19">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
