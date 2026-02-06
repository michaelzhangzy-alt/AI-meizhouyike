import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"

const tabs = [
  { id: "solo", label: "🚀 个人创业" },
  { id: "student", label: "🎓 校园利器" },
  { id: "pro", label: "💼 职场提效" },
]

type Tool = {
    id: number;
    title: string;
    desc: string;
    icon: string;
    tag: string;
    category: string;
    link: string;
    isExternal: boolean;
}

const toolsData: Record<string, Tool[]> = {
  solo: [
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
      isExternal: true
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
    {
      id: 106,
      title: "小红书文案生成器",
      desc: "本站自研工具！一键生成爆款小红书风格文案，带 Emoji 和标签。",
      icon: "📕",
      tag: "自研工具",
      category: "Writing",
      link: "/ai-tools/xiaohongshu",
      isExternal: false
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
      isExternal: true
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
      icon: "�",
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
      title: "通义千问",
      desc: "阿里大模型，通晓中国文化，写公文、写策划、做分析都很在行。",
      icon: "🤖",
      tag: "全能助手",
      category: "Assistant",
      link: "https://tongyi.aliyun.com/",
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
      title: "智谱清言",
      desc: "清华系 GLM-4 模型，数据分析能力强，支持代码解释器和联网搜索。",
      icon: "🧠",
      tag: "数据分析",
      category: "Analysis",
      link: "https://chatglm.cn/",
      isExternal: true
    },
    {
      id: 304,
      title: "文心一言",
      desc: "百度出品，综合能力强，拥有国内最大的知识图谱，适合查询商业资讯。",
      icon: "💬",
      tag: "知识问答",
      category: "Assistant",
      link: "https://yiyan.baidu.com/",
      isExternal: true
    },
    {
      id: 305,
      title: "稿定设计",
      desc: "新媒体运营必备，AI 自动生成海报、抠图、去水印，电商做图神器。",
      icon: "🖼️",
      tag: "设计排版",
      category: "Design",
      link: "https://www.gaoding.com/",
      isExternal: true
    },
    {
      id: 306,
      title: "DeepSeek (深度求索)",
      desc: "国产开源之光，推理能力极强，写代码、做数学题表现惊人，且价格亲民。",
      icon: "🐋",
      tag: "硬核推理",
      category: "Logic",
      link: "https://chat.deepseek.com/",
      isExternal: true
    },
  ]
}

export function MarketSection() {
  const [activeTab, setActiveTab] = useState("solo")

  // Get current tools based on active tab
  const currentTools = toolsData[activeTab] || [];

  return (
    <section className="py-16 pb-24">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">市场精选工具</h2>
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors outline-none",
                    activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-900">
              筛选: 全部类型 <span className="text-xs">▼</span>
            </button>
            <button className="flex items-center gap-1 hover:text-gray-900">
              排序: 推荐 <span className="text-xs">▼</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentTools.map((tool) => {
            const CardContent = (
              <Card className="h-full p-6 hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer group relative">
                 {tool.isExternal && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                 )}
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
                    <span className="text-xs font-medium text-gray-500">{tool.category}</span>
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-gray-500 min-h-[40px]">{tool.desc}</p>
                <Badge variant="default">{tool.tag}</Badge>
              </Card>
            );

            return tool.isExternal ? (
                <a key={tool.id} href={tool.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {CardContent}
                </a>
            ) : (
                <Link key={tool.id} to={tool.link} className="block h-full">
                    {CardContent}
                </Link>
            );
          })}
        </div>
      </div>
    </section>
  )
}
