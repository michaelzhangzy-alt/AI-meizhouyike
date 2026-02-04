import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface NavbarProps {
  onRegisterClick?: () => void;
}

export function Navbar({ onRegisterClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleScrollTop = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: '首页', path: '/' },
    { name: '本周直播课', path: '/weekly-class' },
    { name: '往期回看', path: '/courses' },
    { name: 'AI 资讯', path: '/news' },
    { name: '关于我们', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={() => handleScrollTop('/')}>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            优尼克斯 <span className="text-blue-600">|</span> AI 周课
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600",
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-slate-500"
              )}
              onClick={() => handleScrollTop(item.path)}
            >
              {item.name}
            </Link>
          ))}
          <button 
            onClick={onRegisterClick}
            className="primary-button text-sm"
          >
            立即报名
          </button>
        </div>

        {/* Mobile Menu Button - Hidden since we use MobileNav */}
        {/* <button
          className="md:hidden p-2 text-muted-foreground hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button> */}
        <div className="md:hidden">
          <button 
            onClick={onRegisterClick}
            className="primary-button text-xs px-4 py-2 h-9"
          >
            立即报名
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-base font-medium transition-colors py-2",
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                )}
                onClick={() => {
                  setIsOpen(false);
                  handleScrollTop(item.path);
                }}
              >
                {item.name}
              </Link>
            ))}
            <button 
              className="primary-button w-full" 
              onClick={() => { 
                setIsOpen(false); 
                onRegisterClick?.(); 
              }}
            >
              立即报名
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
