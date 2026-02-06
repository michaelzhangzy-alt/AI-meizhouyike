import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { XiaohongshuGenerator } from '../components/tools/XiaohongshuGenerator';

// Simple frontmatter parser to avoid node Buffer dependency issues in browser
function parseFrontmatter(markdown: string) {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/;
  const match = frontmatterRegex.exec(markdown);
  
  if (!match) {
    return { data: {}, content: markdown };
  }

  const frontmatterBlock = match[1];
  const content = markdown.replace(match[0], '').trim();
  const data: Record<string, any> = {};

  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle boolean
      if (value === 'true') data[key] = true;
      else if (value === 'false') data[key] = false;
      else data[key] = value;
    }
  });

  return { data, content };
}

export default function AiToolDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [frontmatter, setFrontmatter] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setError(null);
      try {
        // Import all markdown files from the content directory
        // The path must be relative to this file
        const modules = import.meta.glob('../content/*.md', { query: '?raw', import: 'default' });
        
        const path = `../content/${slug}.md`;
        
        console.log('Loading markdown from:', path);
        console.log('Available modules:', Object.keys(modules));

        if (modules[path]) {
          const rawMd = await modules[path]() as string;
          const { data, content } = parseFrontmatter(rawMd);
          setFrontmatter(data);
          setContent(content);
        } else {
          console.error(`Module not found: ${path}`);
          setError('Tool not found');
          setContent('# Tool not found');
        }
      } catch (err) {
        console.error("Error loading markdown:", err);
        setError('Error loading content');
        setContent('# Error loading content');
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto py-10 px-6">Loading...</div>;
  }

  if (error && content === '# Tool not found') {
      return (
          <div className="container mx-auto py-10 px-6 text-center">
              <h1 className="text-2xl font-bold mb-4">未找到该工具内容</h1>
              <p className="text-gray-500">请求的工具文档 "{slug}" 不存在。</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto py-10 px-6 max-w-4xl">
      <div className="mb-8 border-b pb-8">
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                {frontmatter.category && <Badge>{frontmatter.category}</Badge>}
                {frontmatter.toolType && <Badge variant="workflow">{frontmatter.toolType}</Badge>}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{frontmatter.title || slug}</h1>
            {frontmatter.description && (
                <p className="text-xl text-gray-600 leading-relaxed">{frontmatter.description}</p>
            )}
            {frontmatter.publishDate && (
                <div className="text-sm text-gray-500 mt-2">
                    发布于 {frontmatter.publishDate}
                </div>
            )}
        </div>
      </div>

      {/* Interactive Tool Section */}
      {slug === 'xiaohongshu' && (
        <XiaohongshuGenerator />
      )}
      
      <article className="prose prose-indigo lg:prose-xl max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
