import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white p-10">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">本周原创首发</h1>
            <p className="text-gray-600">来自“AI周课”的独家智能体与工作流</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Big Card */}
            <Card className="flex flex-col justify-between border-white/60 bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
              <div>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-200 text-4xl shadow-inner">
                  📕
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">小红书爆款文案生成器</h2>
                <p className="mb-4 text-gray-500 leading-relaxed max-w-md">
                  输入关键词，一键生成封面标题 + 正文 + 标签。深度优化算法，命中流量密码。
                </p>
                <Badge variant="workflow">Workflow</Badge>
              </div>
              <div>
                <Link
                  to="/ai-tools/xiaohongshu"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                >
                  立即使用 Try Now
                </Link>
              </div>
            </Card>

            {/* Side Cards */}
            <div className="flex flex-col gap-4">
              <Card className="flex items-center gap-5 p-6 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  📊
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-gray-900">周报自动化 Agent</h3>
                  <p className="text-sm text-gray-500">连接飞书/钉钉，自动汇总日报</p>
                </div>
              </Card>

              <Card className="flex items-center gap-5 p-6 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  🎓
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-gray-900">论文润色助手</h3>
                  <p className="text-sm text-gray-500">学术风格优化，降重利器</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
