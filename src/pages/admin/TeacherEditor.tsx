
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ImageUpload } from '../../components/ui/image-upload';
import { ImageCropperDialog } from '../../components/ui/image-cropper-dialog';
import { Card } from '../../components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function TeacherEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    image_url: '',
    tags: '',
    display_order: 0
  });

  useEffect(() => {
    if (isEdit) {
      fetchTeacher();
    } else {
      // Auto set order for new teacher
      supabase.from('teachers').select('display_order').order('display_order', { ascending: false }).limit(1)
        .then(({ data }) => {
          if (data && data[0]) setFormData(prev => ({ ...prev, display_order: data[0].display_order + 1 }));
        });
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData({
        ...data,
        tags: data.tags ? data.tags.join(',') : ''
      });
    } catch (error) {
      console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        updated_at: new Date().toISOString()
      };

      if (isEdit) {
        const { error } = await supabase
          .from('teachers')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('teachers')
          .insert([payload]);
        if (error) throw error;
      }

      navigate('/admin/teachers');
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      const fileName = `teacher-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('share-images') // Reusing share-images bucket or course-covers is fine
        .upload(fileName, croppedBlob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('share-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: data.publicUrl });
      setCropperOpen(false);
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      alert('图片上传失败');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <ImageCropperDialog
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={cropperImage}
        onCropComplete={handleCropComplete}
        aspect={1} // Square aspect ratio for avatars
      />

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/admin/teachers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? '编辑讲师' : '添加讲师'}
        </h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  无头像
                </div>
              )}
            </div>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => {
                if (url) {
                  setCropperImage(url);
                  setCropperOpen(true);
                } else {
                  setFormData({ ...formData, image_url: '' });
                }
              }}
              className="w-full max-w-xs"
            />
            <p className="text-xs text-gray-500 mt-2">建议上传正方形头像</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">讲师姓名</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="例如：Michael 老师"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">头衔/职位</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="例如：资深架构师"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">标签 (逗号分隔)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="例如：系统架构, 20年实战"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">简介</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="简要介绍讲师背景..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">显示顺序 (越小越靠前)</label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
            />
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? '保存中...' : '保存讲师'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
