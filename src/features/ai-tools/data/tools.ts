
export type Tool = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  tag: string;
  category: string;
  link: string;
  isExternal: boolean;
  isFeatured?: boolean; // 新增字段，用于首页展示
  badge?: string; // 新增字段，用于特殊角标，如 "独家", "自研"
};

export const toolsData: Record<string, Tool[]> = {
  solo: [
    {
      id: 106,
      title: "小红书文案生成器",
      desc: "本站自研工具！一键生成爆款小红书风格文案，带 Emoji 和标签。",
      icon: "📕",
      tag: "自研工具",
      category: "Writing",
      link: "/ai-tools/xiaohongshu",
      isExternal: false,
      isFeatured: true,
      badge: "自研"
    },
    {
      id: 107,
      title: "AI 算命 (Fortune Teller)",
      desc: "测测你的今日运势、爱情运、财运，AI 结合传统易经为您解惑。",
      icon: "🔮",
      tag: "趣味测试",
      category: "Fun",
      link: "/ai-tools/fortune",
      isExternal: false,
      isFeatured: true,
      badge: "热门"
    },
    {
      id: 101,
      title: "即梦 AI (Dreamina)",
      desc: "字节跳动出品的 AI 绘画与视频生成平台，中文提示词友好，出图质量极高。",
      icon: "🎨",
      tag: "图像视频",
      category: "Creative",
      link: "https://jimeng.jianying.com/",
      isExternal: true
    },
    {
      id: 102,
      title: "Trae",
      desc: "集成本地代码库的 AI 编程助手，支持 GPT-4o 和 Claude 3.5，让编程更简单。",
      icon: "💻",
      tag: "编程辅助",
      category: "Coding",
      link: "https://www.trae.ai/",
      isExternal: true,
      isFeatured: true, // 既然是推荐的编程工具，也放在首页吧
      badge: "神器"
    },
    {
      id: 103,
      title: "剪映 (JianYing)",
      desc: "全能视频剪辑工具，内置大量 AI 功能：智能抠像、图文成片、数字人。",
      icon: "🎬",
      tag: "视频剪辑",
      category: "Video",
      link: "https://www.capcut.cn/",
      isExternal: true
    },
    {
      id: 104,
      title: "ListenHub",
      desc: "解说万物，一键生成视频、播客、PPT。文字转语音，AI 重新润色，表达流畅。",
      icon: "🎧",
      tag: "音频生成",
      category: "Audio",
      link: "https://listenhub.ai/zh",
      isExternal: true
    },
    {
      id: 105,
      title: "即时设计 (JsDesign)",
      desc: "国产 UI 设计工具，内置即时 AI，通过文字描述生成可编辑的 UI 设计稿。",
      icon: "✨",
      tag: "UI设计",
      category: "Design",
      link: "https://js.design/",
      isExternal: true
    },
  ],
  student: [
    {
      id: 201,
      title: "Notion AI",
      desc: "笔记中的 AI 助手，自动摘要、改写、扩写，管理你的第二大脑。",
      icon: "📝",
      tag: "笔记管理",
      category: "Writing",
      link: "https://www.notion.so/",
      isExternal: true
    },
    {
      id: 202,
      title: "秘塔 AI 搜索",
      desc: "没有广告的 AI 搜索引擎，结构化展示答案，自动整理脑图和大纲。",
      icon: "🔍",
      tag: "学术搜索",
      category: "Search",
      link: "https://metaso.cn/",
      isExternal: true,
      isFeatured: true,
      badge: "学术"
    },
    {
      id: 203,
      title: "ChatPDF",
      desc: "与 PDF 对话的神器，快速提取论文重点，备考复习、文献阅读必备。",
      icon: "📄",
      tag: "文档阅读",
      category: "Reading",
      link: "https://www.chatpdf.com/",
      isExternal: true
    },
    {
      id: 204,
      title: "Gamma",
      desc: "一键生成 PPT，设计美观，自动排版，支持导入文档，告别通宵做课件。",
      icon: "",
      tag: "PPT工具",
      category: "Presentation",
      link: "https://gamma.app/",
      isExternal: true
    },
    {
      id: 205,
      title: "Zotero",
      desc: "强大的文献管理工具，结合 AI 插件，实现自动化文献抓取、引用和整理。",
      icon: "📚",
      tag: "文献管理",
      category: "Academic",
      link: "https://www.zotero.org/",
      isExternal: true
    },
    {
      id: 206,
      title: "讯飞听见",
      desc: "课堂录音转文字，准确率极高，自动区分说话人，复习备考好帮手。",
      icon: "🎙️",
      tag: "录音转写",
      category: "Tools",
      link: "https://www.iflyrec.com/",
      isExternal: true
    },
  ],
  pro: [
    {
      id: 301,
      title: "DeepSeek (深度求索)",
      desc: "国产开源之光，推理能力极强，写代码、做数学题表现惊人，且价格亲民。",
      icon: "🐋",
      tag: "硬核推理",
      category: "Logic",
      link: "https://chat.deepseek.com/",
      isExternal: true
    },
    {
      id: 302,
      title: "豆包 (Doubao)",
      desc: "字节跳动出品的 AI 助手，语音交互自然，支持网页插件，随时随地提供帮助。",
      icon: "🥣",
      tag: "智能助手",
      category: "Assistant",
      link: "https://www.doubao.com/",
      isExternal: true
    },
    {
      id: 303,
      title: "扣子 (Coze)",
      desc: "字节跳动推出的一站式 AI Bot 开发平台，无需编程，快速搭建你的专属 AI 智能体。",
      icon: "🤖",
      tag: "AI 智能体",
      category: "Platform",
      link: "https://www.coze.cn/",
      isExternal: true
    },
    {
      id: 304,
      title: "腾讯元宝",
      desc: "腾讯出品的 AI 助手，背靠公众号生态，内容搜索和总结能力极强。",
      icon: "💰",
      tag: "内容搜索",
      category: "Assistant",
      link: "https://yuanbao.tencent.com/",
      isExternal: true
    },
    {
      id: 305,
      title: "通义千问",
      desc: "阿里大模型，通晓中国文化，写公文、写策划、做分析都很在行。",
      icon: "🧠",
      tag: "全能助手",
      category: "Assistant",
      link: "https://tongyi.aliyun.com/",
      isExternal: true
    },
    {
      id: 306,
      title: "文心一言",
      desc: "百度出品，综合能力强，拥有国内最大的知识图谱，适合查询商业资讯。",
      icon: "💬",
      tag: "知识问答",
      category: "Assistant",
      link: "https://yiyan.baidu.com/",
      isExternal: true
    },
  ]
}

export const getAllTools = () => {
    return Object.values(toolsData).flat();
}

export const getFeaturedTools = () => {
    return getAllTools().filter(tool => tool.isFeatured);
}
