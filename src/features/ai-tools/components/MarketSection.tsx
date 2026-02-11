
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"
import { toolsData } from "../data/tools"

const tabs = [
  { id: "solo", label: "🚀 个人创业" },
  { id: "student", label: "🎓 校园利器" },
  { id: "pro", label: "💼 职场提效" },
]

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
