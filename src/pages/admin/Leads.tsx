
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Download, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import * as XLSX from 'xlsx';

interface Lead {
  id: string;
  name: string;
  phone: string;
  wechat?: string;
  interested_course?: string;
  source: string;
  status: string;
  member_type?: string;
  remark?: string;
  created_at: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataToExport = leads.map(lead => ({
      '姓名': lead.name,
      '电话': lead.phone,
      '微信': lead.wechat || '-',
      '意向课程': lead.interested_course || '-',
      '来源': lead.source,
      '类型': lead.member_type === 'old_paid' ? '老会员' : '新线索',
      '状态': lead.status === 'new' ? '待处理' : lead.status,
      '备注': lead.remark || '-',
      '提交时间': new Date(lead.created_at).toLocaleString('zh-CN'),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `报名数据_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.includes(searchTerm) || 
    lead.phone?.includes(searchTerm) ||
    lead.wechat?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">报名管理</h2>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          导出 Excel
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜索姓名、电话或微信"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">时间</th>
                <th className="px-6 py-3">姓名</th>
                <th className="px-6 py-3">联系方式</th>
                <th className="px-6 py-3">意向</th>
                <th className="px-6 py-3">来源</th>
                <th className="px-6 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">加载中...</td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">暂无数据</td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4">
                      <div>{lead.phone}</div>
                      {lead.wechat && <div className="text-xs text-gray-500">微: {lead.wechat}</div>}
                    </td>
                    <td className="px-6 py-4">{lead.interested_course || '-'}</td>
                    <td className="px-6 py-4">{lead.source}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        {lead.member_type === 'old_paid' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-200 font-medium">
                            老会员
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                            新线索
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status === 'new' ? '待处理' : lead.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
