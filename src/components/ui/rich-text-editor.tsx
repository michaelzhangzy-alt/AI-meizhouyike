
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { supabase } from '../../lib/supabase';
import { Button } from './button';
import { Wand2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  bucket?: string;
  height?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  bucket = 'course-covers',
  height = 500 
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  const handleImageUpload = async (blobInfo: any, progress: any) => {
    try {
      const file = blobInfo.blob();
      const fileExt = file.name ? file.name.split('.').pop() : 'png';
      const fileName = `editor-img-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleOneClickFormat = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      
      // 1. Basic cleaning
      editor.execCommand('RemoveFormat');
      
      // 2. Set standard font and size
      editor.execCommand('FontName', false, 'System-UI, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
      editor.execCommand('FontSize', false, '16px');
      
      // 3. Apply standard paragraph styling via DOM manipulation
      const body = editor.getBody();
      const paragraphs = body.getElementsByTagName('p');
      for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.lineHeight = '1.8';
        paragraphs[i].style.marginBottom = '20px';
        paragraphs[i].style.color = '#333';
        paragraphs[i].style.textAlign = 'justify';
      }

      // 4. Style images
      const images = body.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        images[i].style.maxWidth = '100%';
        images[i].style.height = 'auto';
        images[i].style.borderRadius = '8px';
        images[i].style.display = 'block';
        images[i].style.margin = '20px auto';
        images[i].style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }

      // 5. Style Headings
      const headings = body.querySelectorAll('h1, h2, h3');
      headings.forEach((h: any) => {
        h.style.color = '#1a1a1a';
        h.style.marginTop = '40px';
        h.style.marginBottom = '20px';
        h.style.fontWeight = 'bold';
      });

      // Update content
      onChange(editor.getContent());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleOneClickFormat}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          一键排版
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Editor
          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
          onInit={(evt, editor) => editorRef.current = editor}
          value={value}
          onEditorChange={onChange}
          init={{
            height: height,
            menubar: false,
            language: 'zh_CN', // Assuming zh_CN might not be loaded by default in cloud version, it falls back to en.
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | image table | help',
            content_style: 'body { font-family:System-UI, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size:16px; line-height:1.8; color:#333 } img { max-width: 100%; height: auto; }',
            images_upload_handler: handleImageUpload,
            // Enhanced paste handling
            paste_preprocess: (plugin: any, args: any) => {
              // Optionally manipulate content before paste
              // This is a hook if we want to do something custom
            },
            paste_data_images: true, 
            smart_paste: true, // Better Word paste handling
            paste_as_text: false, // Don't force plain text
            automatic_uploads: true,
            file_picker_types: 'image',
            auto_focus: true,
          }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">
        * 支持从 Word/微信/飞书直接粘贴，图片将自动上传
      </p>
    </div>
  );
}
