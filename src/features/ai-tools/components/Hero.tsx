import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary/10 to-background p-10">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">本周原创AI工具</h1>
            <p className="text-muted-foreground">来自“AI周课”的独家智能体与工作流</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Big Card */}
            <Card className="flex flex-col justify-between border-border bg-card p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
              <div>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl shadow-inner">
                  📕
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">小红书爆款文案生成器</h2>
                <p className="mb-4 text-muted-foreground leading-relaxed max-w-md">
                  输入关键词，一键生成封面标题 + 正文 + 标签。深度优化算法，命中流量密码。
                </p>
                <Badge variant="workflow">Workflow</Badge>
              </div>
              <div>
                <Link
                  to="/ai-tools/xiaohongshu"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-80"
                >
                  立即使用 Try Now
                </Link>
              </div>
            </Card>

            {/* Side Cards */}
            <div className="flex flex-col gap-4">
              <Link to="/ai-tools/fortune" className="block">
                <Card className="flex items-center gap-5 p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full border-border bg-card">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-xl">
                    🔮
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-foreground">科学算运势</h3>
                    <p className="text-sm text-muted-foreground">扣子智能体驱动，测测你的今日运势</p>
                  </div>
                </Card>
              </Link>

              <Card className="flex items-center gap-5 p-6 hover:border-primary/50 hover:shadow-md transition-all border-border bg-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
                  🎓
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground">论文润色助手</h3>
                  <p className="text-sm text-muted-foreground">学术风格优化，降重利器</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
