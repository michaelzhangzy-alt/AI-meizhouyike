import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website' 
}: SEOProps) {
  const siteTitle = 'AI周课';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - 大学生AI实战技能提升平台`;
  
  const defaultDescription = '每周一节公开课，大厂专家手把手教学。掌握ChatGPT、DeepSeek、AI编程、AI智能体、AI绘画、自动化办公等核心技能，提升职场竞争力。';
  const metaDescription = description || defaultDescription;
  
  const defaultKeywords = 'AI周课, AI培训, 人工智能课程, 大学生技能提升, ChatGPT教程, DeepSeek, AI实战, 优尼克斯';
  const metaKeywords = keywords || defaultKeywords;
  
  const siteUrl = window.location.origin;
  const currentUrl = url || window.location.href;
  const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
}
