import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlayCircle, Newspaper, User, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { name: '首页', path: '/', icon: Home },
    { name: '直播课', path: '/weekly-class', icon: PlayCircle },
    { name: '工具', path: '/ai-tools', icon: Wrench },
    { name: '资讯', path: '/news', icon: Newspaper },
    { name: '关于', path: '/about', icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm md:hidden">
      <nav className="flex items-center justify-around bg-slate-900/90 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 shadow-2xl shadow-slate-900/20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200 relative group",
                isActive ? "text-white scale-110" : "text-slate-400 hover:text-white"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-all",
                isActive && "bg-white/10"
              )}>
                <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
              
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}