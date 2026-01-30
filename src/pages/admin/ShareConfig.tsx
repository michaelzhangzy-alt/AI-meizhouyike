
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ImageUpload } from '../../components/ui/image-upload';
import { Card } from '../../components/ui/card';
import { Save, Plus, Trash, HelpCircle, Info } from 'lucide-react';

interface ShareConfig {
  id: string;
  page_path: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export default function ShareConfig() {
  const [configs, setConfigs] = useState<ShareConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('share_configs')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error fetching share configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: ShareConfig) => {
    try {
      if (config.id.startsWith('temp-')) {
        // Create new
        const { id, ...newConfig } = config;
        const { data, error } = await supabase
          .from('share_configs')
          .insert([newConfig])
          .select()
          .single();
        
        if (error) throw error;
        setConfigs(configs.map(c => c.id === config.id ? data : c));
      } else {
        // Update existing
        const { error } = await supabase
          .from('share_configs')
          .update(config)
          .eq('id', config.id);
        
        if (error) throw error;
      }
      alert('保存成功');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('temp-')) {
      setConfigs(configs.filter(c => c.id !== id));
      return;
    }
    
    if (!confirm('确定删除此配置？')) return;
    
    try {
      const { error } = await supabase.from('share_configs').delete().eq('id', id);
      if (error) throw error;
      setConfigs(configs.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  const addNew = () => {
    setConfigs([
      ...configs, 
      {
        id: `temp-${Date.now()}`,
        page_path: '/',
        title: '默认分享标题',
        description: '默认分享描述',
        image_url: '',
        is_active: true
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">微信分享配置</h2>
          <p className="text-sm text-gray-500 mt-1">自定义不同页面在微信聊天、朋友圈中的分享卡片样式</p>
        </div>
        <Button onClick={addNew}>
          <Plus className="w-4 h-4 mr-2" />
          添加配置
        </Button>
      </div>

      {/* Usage Guide */}
      <Card className="bg-blue-50 border-blue-100 p-4">
        <div className="flex gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 space-y-2">
            <p className="font-bold">如何使用分享配置？</p>
            <ul className="list-disc list-inside space-y-1 opacity-90">
              <li><strong>页面路径</strong>：填写网站的相对路径。首页填 <code>/</code>，资讯页填 <code>/news</code>，关于页填 <code>/about</code>。</li>
              <li><strong>优先级</strong>：系统会自动匹配当前访问的页面。如果没配置，将使用系统默认信息。</li>
              <li><strong>生效条件</strong>：此功能仅在<strong>正式域名</strong>环境下生效，且需在微信公众号后台配置“JS接口安全域名”。</li>
              <li><strong>特别说明</strong>：资讯详情页（如 <code>/news/xxx</code>）会自动提取文章标题和封面，无需在此重复配置。</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid gap-6">
        {configs.map((config) => (
          <Card key={config.id} className="p-6 relative group hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    页面路径
                    <span className="text-xs font-normal text-gray-400">(匹配该路径时展示)</span>
                  </label>
                  <Input
                    value={config.page_path}
                    onChange={(e) => setConfigs(configs.map(c => c.id === config.id ? {...c, page_path: e.target.value} : c))}
                    placeholder="例如: / 或 /news"
                  />
                  <p className="text-[11px] text-gray-400">匹配规则：完全匹配当前 URL 路径</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">分享标题</label>
                  <Input
                    value={config.title}
                    onChange={(e) => setConfigs(configs.map(c => c.id === config.id ? {...c, title: e.target.value} : c))}
                    placeholder="建议 15 字以内"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">分享描述</label>
                  <Input
                    value={config.description}
                    onChange={(e) => setConfigs(configs.map(c => c.id === config.id ? {...c, description: e.target.value} : c))}
                    placeholder="建议 30 字以内"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  分享缩略图
                  <span className="text-xs font-normal text-gray-400">(微信卡片左侧小图)</span>
                </label>
                <ImageUpload
                  value={config.image_url}
                  onChange={(url) => setConfigs(configs.map(c => c.id === config.id ? {...c, image_url: url} : c))}
                  bucket="share-images"
                />
                <p className="text-[11px] text-gray-400 italic flex items-center gap-1 mt-2">
                  <Info className="w-3 h-3" /> 建议使用正方形 (1:1) 图片，尺寸 300x300 以上效果最佳
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(config.id)}
              >
                <Trash className="w-4 h-4 mr-1" />
                删除
              </Button>
              <Button 
                size="sm"
                onClick={() => handleSave(config)}
              >
                <Save className="w-4 h-4 mr-1" />
                保存
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
