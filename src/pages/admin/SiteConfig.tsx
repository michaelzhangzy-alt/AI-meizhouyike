
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { RichTextEditor } from '../../components/ui/rich-text-editor';
import { Save, Loader2, Plus, Trash } from 'lucide-react';
import { Input } from '../../components/ui/input';

interface PageFragment {
  id: string;
  slug: string;
  title: string;
  content: any;
  description: string;
}

export default function SiteConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fragments, setFragments] = useState<PageFragment[]>([]);
  const [activeTab, setActiveTab] = useState<'about_us' | 'member_benefits'>('about_us');

  useEffect(() => {
    fetchFragments();
  }, []);

  const fetchFragments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_fragments')
        .select('*');

      if (error) throw error;
      setFragments(data || []);
    } catch (error) {
      console.error('Error fetching fragments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (slug: string, content: any) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('page_fragments')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug);

      if (error) throw error;
      alert('保存成功！');
      fetchFragments(); // Refresh data
    } catch (error) {
      console.error('Error saving fragment:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // Helper to get fragment by slug
  const getFragment = (slug: string) => fragments.find(f => f.slug === slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">网站内容配置</h2>
      </div>

      <div className="flex space-x-2 border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'about_us' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('about_us')}
        >
          关于我们
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'member_benefits' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('member_benefits')}
        >
          会员权益
        </button>
      </div>

      {activeTab === 'about_us' && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">关于我们 - 介绍文案</h3>
            <p className="text-sm text-gray-500 mb-4">
              这段内容将显示在“关于我们”页面的主要介绍区域。
            </p>
            <RichTextEditor
              value={getFragment('about_us')?.content || ''}
              onChange={(val) => {
                const fragment = getFragment('about_us');
                if (fragment) {
                  setFragments(fragments.map(f => f.slug === 'about_us' ? {...f, content: val} : f));
                }
              }}
              height={400}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => handleSave('about_us', getFragment('about_us')?.content)}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? '保存中...' : '保存更改'}
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'member_benefits' && (
        <MemberBenefitsEditor 
          initialData={getFragment('member_benefits')?.content || []}
          onSave={(data) => handleSave('member_benefits', data)}
          saving={saving}
        />
      )}
    </div>
  );
}

// Sub-component for editing Member Benefits List
function MemberBenefitsEditor({ initialData, onSave, saving }: { initialData: any[], onSave: (data: any[]) => void, saving: boolean }) {
  const [benefits, setBenefits] = useState<any[]>(Array.isArray(initialData) ? initialData : []);

  useEffect(() => {
    if (Array.isArray(initialData)) {
      setBenefits(initialData);
    }
  }, [initialData]);

  const addBenefit = () => {
    setBenefits([...benefits, { title: '新权益', description: '权益描述...' }]);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    setBenefits(newBenefits);
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setBenefits(newBenefits);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">会员权益列表</h3>
        <p className="text-sm text-gray-500">
          配置显示在“关于我们”页面底部的会员权益卡片。
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">标题</label>
                <Input 
                  value={benefit.title} 
                  onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                  placeholder="权益标题"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">描述</label>
                <Input 
                  value={benefit.description} 
                  onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                  placeholder="权益详细描述"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-6"
              onClick={() => removeBenefit(index)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={addBenefit}>
          <Plus className="w-4 h-4 mr-2" />
          添加权益
        </Button>
        <Button onClick={() => onSave(benefits)} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? '保存中...' : '保存更改'}
        </Button>
      </div>
    </Card>
  );
}
