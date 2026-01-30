
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from './button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  className?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  bucket = 'course-covers',
  className 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('图片上传失败，请重试');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
      
      {value ? (
        <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-gray-100 group">
          <img 
            src={value} 
            alt="Upload preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
             <Button 
               type="button"
               variant="secondary" 
               size="sm"
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
             >
               {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
               更换
             </Button>
             <Button 
               type="button"
               variant="destructive" 
               size="sm"
               onClick={() => onChange('')}
               disabled={uploading}
             >
               <X className="w-4 h-4 mr-2" />
               移除
             </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors max-w-sm"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
          <span className="text-sm text-gray-500">
            {uploading ? '上传中...' : '点击上传图片'}
          </span>
        </div>
      )}
    </div>
  );
}
