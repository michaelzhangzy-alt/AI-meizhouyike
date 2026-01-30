
import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/admin/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!session) return null;

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
