
import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap,
  BookOpen, 
  FileText, 
  Share2,
  Settings,
  LogOut 
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminLayout() {
  const { session, loading, signOut } = useAuthStore();
  const location = useLocation();

  // 调试日志：帮助我们确认当前状态
  // console.log('AdminLayout State:', { loading, hasSession: !!session });

  // 1. 只有在真正需要等待的时候才显示 Loading
  // 这里的关键是：如果 loading 为 true，我们必须确信它是真的在加载中
  // 如果 loading 为 true 但 session 已经有了（比如初始化过程中监听器先触发了），那就不需要 Loading 界面了
  if (loading && !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500">系统加载中...</p>
      </div>
    );
  }

  // 2. 加载结束（或已有 Session），检查是否已登录
  if (!session) {
    // 强制跳转到登录页，并带上 `replace` 属性替换当前历史记录，防止回退死循环
    return <Navigate to="/admin/login" replace />;
  }

  // 3. 已登录，显示后台布局
  const navItems = [
    { label: '仪表盘', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: '报名管理', icon: Users, path: '/admin/leads' },
    { label: '付费会员', icon: Users, path: '/admin/members' },
    { label: '师资管理', icon: GraduationCap, path: '/admin/teachers' },
    { label: '课程管理', icon: BookOpen, path: '/admin/courses' },
    { label: '资讯管理', icon: FileText, path: '/admin/articles' },
    { label: '分享配置', icon: Share2, path: '/admin/share-config' },
    { label: '站点内容', icon: Settings, path: '/admin/site-config' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">UnixTech Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5 mr-3" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
