# unixtech-xyz

公开课引流 + 内容沉淀 + AI 工具 + 后台运营的一体化教育官网平台。

## 子系统

- 前台（Public）：课程/资讯/关于我们/AI 工具、报名留资、微信分享
- 后台（Admin CMS）：课程/资讯/师资管理、线索导出、分享配置、站点内容、付费会员与群二维码管理

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量（本地）

在项目根目录创建 `.env`（或使用 Vite 支持的 `.env.local`），至少需要：

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

注意：不要在仓库中提交任何密钥/服务端 Key。线上环境变量由 Vercel/Supabase 配置注入。

### 3) 本地启动

```bash
npm run dev
```

- 前台：`http://localhost:5173/`
- 后台登录：`/admin/login`

### 4) 构建与本地预览（可选）

```bash
npm run build
npm run preview
```

## 环境变量说明

- `VITE_SUPABASE_URL`：Supabase Project URL（前端连接入口）
- `VITE_SUPABASE_ANON_KEY`：Supabase anon key（前端使用的公开 key）

与微信/AI 相关的敏感密钥应通过 Supabase Edge Functions 的 Secrets 或平台环境变量注入（不要前端直传/不要硬编码）。

## 目录结构（关键部分）

- `src/App.tsx`：路由入口（前台/后台路由与懒加载）
- `src/pages`：前台页面（Home/News/Courses/WeeklyClass/About 等）
- `src/pages/admin`：后台页面（登录、内容管理、线索、配置等）
- `src/components`：通用组件（layout 与业务组件）
- `src/features/ai-tools`：AI 工具模块（营销页、工具页、本地 Markdown 内容）
- `src/store`：Zustand 状态（登录态、列表缓存）
- `src/hooks`：横切能力（主题、微信分享、分享锁等）
- `src/lib/supabase.ts`：Supabase client 初始化
- `supabase/migrations`：数据库 schema / RLS / storage buckets / RPC
- `supabase/functions`：Edge Functions（微信签名、AI 代理等）

## 常见问题（FAQ）

- 本地启动提示缺少 Supabase 环境变量：确认 `.env` 已配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。
- 刷新任意路由 404：生产部署需要 SPA rewrite（Vercel 已通过 `vercel.json` 配置）。
- 微信分享在本地不生效：本地（localhost）会跳过签名拉取；需线上域名且在公众号后台配置 JS 安全域名。
- 动态路由分享配置（如 `/news/:id`）不命中：当前分享配置以精确路径匹配为主，建议阶段二引入前缀/规则匹配。
- 线索隐私：产品目标通常是“允许匿名写入，不允许匿名读取”；请对照 Supabase RLS 策略进行安全验收。

## 部署入口与注意事项

- Vercel：
  - `npm run build` 构建
  - 配置环境变量 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`
  - 保持 SPA rewrite（见 `vercel.json`）
- Supabase：
  - 迁移（`supabase/migrations`）包含表结构/RLS/Storage 策略
  - Edge Functions 需要配置 Secrets（微信、AI 等第三方密钥）

## 相关文档

- [CONTENT_MAP.md](./CONTENT_MAP.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [PRD.md](./PRD.md)
- [CHANGELOG.md](./CHANGELOG.md)
