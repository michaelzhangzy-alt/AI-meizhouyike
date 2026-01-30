
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ImageUpload } from '../../components/ui/image-upload';
import { RichTextEditor } from '../../components/ui/rich-text-editor';
import { ImageCropperDialog } from '../../components/ui/image-cropper-dialog';
import { Card } from '../../components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    cover_image: '',
    status: 'draft',
    seo_keywords: ''
  });

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    } else {
      setInitialData(formData); // Set initial data for new article
    }
  }, [id]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if data changed
      const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, initialData]);

  const handleBack = () => {
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
    if (isDirty && !confirm('您有未保存的更改，确定要离开吗？')) {
      return;
    }
    navigate('/admin/articles');
  };

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData(data);
      setInitialData(data); // Store initial data for comparison
    } catch (error) {
      console.error('Error fetching article:', error);
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
        updated_at: new Date().toISOString()
      };

      if (isEdit) {
        const { error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([payload]);
        if (error) throw error;
      }

      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      const fileName = `cover-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(fileName, croppedBlob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('course-covers')
        .getPublicUrl(fileName);

      setFormData({ ...formData, cover_image: data.publicUrl });
      setCropperOpen(false);
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      alert('封面设置失败');
    }
  };

  const handleImageSelect = (url: string) => {
    setCropperImage(url);
    setCropperOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ImageCropperDialog
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={cropperImage}
        onCropComplete={handleCropComplete}
        aspect={16 / 9}
      />
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? '编辑资讯' : '发布新资讯'}
        </h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">文章标题</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="输入引人注目的标题"
            />
          </div>
            
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">封面图片</label>
            <div className="space-y-4">
              <ImageUpload
                value={formData.cover_image}
                onChange={(url) => {
                  // If user uploads a new image via ImageUpload component, we want to crop it too.
                  // But ImageUpload currently uploads directly. 
                  // For better UX, we can treat the uploaded URL as a source for cropping.
                  if (url) handleImageSelect(url);
                  else setFormData({...formData, cover_image: ''});
                }}
              />
              {/* Image Selector from Content */}
              <div className="flex gap-2 flex-wrap">
                 {(() => {
                   // Extract images from content
                   const extractImages = (html: string) => {
                     if (!html) return [];
                     try {
                       const parser = new DOMParser();
                       const doc = parser.parseFromString(html, 'text/html');
                       const imgs = doc.getElementsByTagName('img');
                       return Array.from(imgs).map(img => img.src).filter(src => src);
                     } catch (e) {
                       return [];
                     }
                   };

                   const images = extractImages(formData.content);
                   
                   if (images.length === 0) return null;

                   return (
                     <div className="w-full">
                       <p className="text-xs text-gray-500 mb-2">或从正文中选择（点击裁剪）：</p>
                       <div className="flex gap-2 overflow-x-auto pb-2">
                         {images.map((img, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => handleImageSelect(img)}
                             className={`cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0 w-24 h-16 ${formData.cover_image === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                           >
                             <img src={img} className="w-full h-full object-cover" />
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })()}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">摘要 (用于列表页和SEO描述)</label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              placeholder="简要概括文章内容..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">正文内容</label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({...formData, content: content})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">SEO 关键词 (逗号分隔)</label>
            <Input
              value={formData.seo_keywords}
              onChange={(e) => setFormData({...formData, seo_keywords: e.target.value})}
              placeholder="AI, 培训, 大模型..."
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <select
              className="px-3 py-2 rounded-md border border-gray-300"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="draft">存为草稿</option>
              <option value="published">立即发布</option>
              <option value="archived">归档</option>
            </select>

            <div className="flex-1"></div>

            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? '保存中...' : '保存文章'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
