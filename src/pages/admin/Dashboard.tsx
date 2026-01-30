
import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { Users, BookOpen, FileText, ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  weeklyLeads: number;
  publishedCourses: number;
  totalArticles: number;
}

interface RecentLead {
  id: string;
  name: string;
  phone: string;
  interested_course: string;
  created_at: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    weeklyLeads: 0,
    publishedCourses: 0,
    totalArticles: 0
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Get Weekly Leads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: weeklyLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // 2. Get Published Courses
      const { count: publishedCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // 3. Get Total Articles
      const { count: totalArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      // 4. Get Recent Leads (last 5)
      const { data: recent } = await supabase
        .from('leads')
        .select('id, name, phone, interested_course, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        weeklyLeads: weeklyLeads || 0,
        publishedCourses: publishedCourses || 0,
        totalArticles: totalArticles || 0
      });
      setRecentLeads(recent || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">后台概览</h2>
        <button 
          onClick={fetchDashboardData}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          刷新数据
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">本周新增报名</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.weeklyLeads}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <Link to="/admin/leads" className="text-xs text-blue-600 mt-4 flex items-center hover:underline">
            查看全部线索 <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">已发布课程</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.publishedCourses}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <Link to="/admin/courses" className="text-xs text-green-600 mt-4 flex items-center hover:underline">
            管理课程 <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">资讯文章数</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalArticles}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <Link to="/admin/articles" className="text-xs text-purple-600 mt-4 flex items-center hover:underline">
            撰写新文章 <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card className="p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">最近报名动态</h3>
          <div className="space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.interested_course || '通用咨询'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(lead.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {lead.status === 'new' ? '新线索' : lead.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500 text-sm">暂无最新报名线索</p>
            )}
          </div>
          <Link to="/admin/leads" className="block text-center text-sm text-blue-600 mt-6 hover:underline">
            查看所有报名信息
          </Link>
        </Card>

        {/* Quick Tips */}
        <Card className="p-6 shadow-sm bg-blue-50/50 border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">运营小贴士</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                💡
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>及时跟进线索：</strong> 收到新报名后 24 小时内联系，转化率可提升 50% 以上。
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                📝
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>保持资讯更新：</strong> 每周发布 1-2 篇 AI 相关的实战干货，有助于提升网站 SEO 和用户粘性。
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                📢
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>分享配置：</strong> 记得为每一篇新文章在后台配置精美的微信分享卡片，吸引更多精准流量。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
