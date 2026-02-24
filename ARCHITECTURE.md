# ARCHITECTURE（技术架构定版）

本文档固化当前仓库“现状事实 + 关键决策 + 可持续演进边界”。目标读者：新同学接手开发、运维同学排障、产品/运营理解哪些可配置、哪些需要开发。

## 1. 技术栈（现状事实）

- 前端：React 18 + Vite + TypeScript
- 路由：react-router-dom（BrowserRouter）
- UI 与样式：TailwindCSS（CSS 变量主题体系）+ Radix Dialog + 自建 UI 组件
- 动效：framer-motion
- 状态：Zustand（auth 与列表缓存）
- 富文本：TinyMCE（后台编辑）
- BaaS：Supabase（Postgres + RLS、Storage、Edge Functions、Auth）
- AI 流式：eventsource-parser（SSE 解析）
- 部署：Vercel（SPA rewrite 到 `/index.html`）

## 2. 前端架构

### 2.1 入口与运行时

- 渲染入口：`src/main.tsx` 将 `App` 挂载到 `#root`，并提供 HelmetProvider（SEO）。
- 路由入口：`src/App.tsx` 使用 BrowserRouter，页面/布局大量使用 React.lazy + Suspense 做懒加载。
- 全局副作用：
  - 登录态初始化：`useAuthStore.initialize()`（监听 auth state + 拉初始 session）。
  - 微信分享初始化：`useWeChatShare()`（线上环境按路由变化拉签名与分享配置）。

### 2.2 路由与模块边界

路由分为三层：

1) 根路径 `/`：Console 风格入口（独立页面组件）。  
2) 前台 PublicLayout：`/home`、`/weekly-class`、`/courses*`、`/news*`、`/about`、`/ai-tools*`。  
3) 后台 AdminLayout：`/admin/*`，除 `/admin/login` 外均需 session。

模块边界建议按“业务域”理解：

- `src/pages/*`：前台页面域（课程、资讯、关于、公开课等）。
- `src/pages/admin/*`：后台运营域（CMS + 配置 + 数据导出）。
- `src/features/ai-tools/*`：AI 工具域（营销与交互工具）。
- `src/components/layout/*`：公共布局与导航（前台/后台）。
- `src/components/ui/*`：基础 UI 组件（Button/Dialog/Modal/Input 等）。
- `src/store/*`：全局状态（auth、缓存）。
- `src/hooks/*`：横切能力（主题、微信分享、分享锁等）。
- `src/lib/*`：基础设施封装（Supabase client、画布工具、埋点封装等）。

### 2.3 数据获取与渲染模式

现状主要是“页面组件内直接调用 supabase client”，没有单独的数据层抽象：

- 读取：`supabase.from(<table>).select(...).eq(...).order(...).limit(...)`
- 写入：`supabase.from(<table>).insert/update/delete` 或 `supabase.rpc(...)`
- Edge Function：
  - `supabase.functions.invoke('wechat-signature', { body })`
  - AI 流式工具使用 `fetch(<functions/v1/...>)` 直连（未统一走 `invoke`）

### 2.4 主题体系（Tailwind + CSS Variables）

- Tailwind `darkMode: "class"`，通过 `documentElement` 切换 `light/dark` class 实现主题。
- `src/index.css` 定义一套 CSS 变量（`--background/--foreground/--primary/...`），暗色模式使用 `.dark` 覆盖。
- `useTheme` 负责读写 `localStorage('theme')` 并更新 DOM class。

### 2.5 SEO（Helmet）

- `src/components/SEO.tsx` 统一写入 title/description/keywords、OG/Twitter、canonical 等。
- `index.html` 也包含静态 meta；运行时 Helmet 会在页面侧进一步覆盖/补充。

## 3. 数据层（Supabase）

### 3.1 Supabase 客户端

前端通过 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY` 初始化浏览器端 Supabase client。

注意：仓库根目录当前存在 `.env` 文件。建议将其视为本地开发文件，不作为交付物；生产环境变量由平台（例如 Vercel/Supabase）注入。

### 3.2 表（Tables）与用途

下表是“页面/功能”与“数据对象”对应关系（详细页级说明见 CONTENT_MAP.md）：

- 转化/报名：`leads`
- 内容：`courses`、`articles`、`teachers`
- 课程分类：`course_series`（当前前台已使用，后台未提供管理 UI）
- 页面碎片：`page_fragments`（例如 about_us、member_benefits）
- 微信分享：`share_configs`（按 `page_path` 管理）
- 会员体系：`paid_members`（老付费名单）、`wechat_group_qr`（群二维码）
- 推荐/裂变（迁移已存在）：`profiles`、`referrals`（当前前端未见接入）

### 3.3 行级安全（RLS）与权限策略（现状）

总体策略是“前台匿名只读已发布内容；后台 authenticated 全管理”，但当前存在需要注意的例外：

- `courses/articles/share_configs`：匿名只能读 `status='published'` / `is_active=true`（RLS 策略已固化在迁移中）。
- `teachers/page_fragments`：匿名可读；authenticated 可写。
- `paid_members/wechat_group_qr`：前台仅允许读取特定状态（例如 active）；authenticated 全管理。
- `leads`：迁移中存在“允许匿名 SELECT”的策略（会导致线索可被匿名读取的风险）。如果产品目标是“前台可匿名写入，但严禁匿名读取”，需要在 Supabase 侧修订 RLS（建议作为阶段二的安全整改项）。

### 3.4 RPC（数据库函数）

当前前端有实际调用的 RPC：

- `submit_lead(...) -> jsonb`
  - 作用：写 leads + 匹配老付费用户 + 可能返回群二维码信息。
  - 备注：前端存在 fallback（RPC 不可用时改为直接 insert leads）。
- `increment_article_views(article_id) -> void`
  - 作用：资讯详情页阅读量 +1（匿名可执行）。

### 3.5 Storage（文件存储）

仓库迁移中定义了多个 bucket（按用途隔离）：

- `course-covers`：课程封面
- `share-images`：分享图
- `wechat-groups`：微信群二维码相关图片

策略目标：匿名可读（前台展示），authenticated 才可写（后台上传/删除）。

### 3.6 Edge Functions（现状清单）

Edge Functions 位于 `supabase/functions/*`：

- `wechat-signature`：微信 JS-SDK 签名（依赖 WeChat AppId/Secret 的服务端环境变量）。
- `fortune-teller`：代理转发到第三方 AI（SSE 透传）。  
  - 现状风险：函数代码内存在硬编码第三方 API Key，应迁移到 Supabase Functions Secrets/环境变量并轮换密钥。
- `submit-lead`：使用 Service Role Key 插入 leads（当前前端未检索到调用，功能与 RPC submit_lead 逻辑重叠）。
- `generate-xiaohongshu`、`chat-coze`：仓库存在但前端未见调用的功能入口。

## 4. 鉴权与权限边界

### 4.1 前端鉴权（后台）

- Auth 状态由 `useAuthStore` 维护：
  - 初始化时注册 `onAuthStateChange` 监听，并获取初始 session。
  - `AdminLayout` 以“是否存在 session”为准决定是否允许访问后台路由；无 session 则跳转 `/admin/login`。

### 4.2 数据权限（推荐边界）

建议将权限边界明确为两条：

- Public（匿名访问）：只读“已发布内容”与“已启用配置”；允许提交线索（写）。
- Admin（authenticated）：管理所有数据对象（CRUD）与上传文件；查看线索。

当前需要特别校验的一点是 `leads` 的匿名读取权限（见 3.3）。

## 5. 性能策略（现状 + 建议）

### 5.1 现状已实现

- 路由级懒加载：页面与布局大量 React.lazy，减少首屏 bundle。
- 查询限量：列表查询普遍有 `.limit(10/12/...)`，避免一次性拉全量。
- 前端缓存：`useCacheStore` 5 分钟缓存新闻/课程/公开课列表，降低重复请求。

### 5.2 建议补齐（不改变业务逻辑的前提）

- 图片策略：统一使用合适尺寸（Storage 侧可做处理或 CDN 参数），并确保 img 有 lazy loading（如需提升 LCP，可做“首屏优先加载 + 其余懒加载”）。
- 数据请求治理：
  - 将 “列表页数据读取”抽到 `src/lib/api/*`，统一处理 limit、排序、错误、重试与缓存策略。
  - 对动态路由的分享配置加入“前缀匹配/默认降级”减少额外查询。
- 监控与告警：为 Edge Function 与前端错误引入统一上报（见 6.2）。

## 6. 错误处理与可观测性

### 6.1 现状模式

- 前端：以 `try/catch + console.error` 为主；用户提示多为 `alert` 或页面局部错误文案。
- 后端（Edge Functions）：错误返回风格不一致（部分函数会返回 200 并在 body 里带 error）。
- 全局兜底：未发现统一 ErrorBoundary/错误上报。

### 6.2 建议的可观测性最低闭环

- 前端：
  - 引入全局 ErrorBoundary（捕获 React 渲染错误）。
  - 统一错误提示组件（替代散落 alert）。
  - 接入错误上报（Sentry 等）与环境标识（dev/prod）。
- Edge Functions：
  - 统一错误返回（HTTP status 与 body 结构），并在日志中打印 requestId。
  - 对第三方 API 失败做分类（鉴权失败/限流/超时）并返回可行动提示。

## 7. 部署架构与配置

### 7.1 前端部署（Vercel）

- 构建命令：`npm run build`（TypeScript build + Vite build）。
- SPA 路由：`vercel.json` 将所有路径 rewrite 到 `/index.html`，保证前端路由可直达。
- 环境变量：在 Vercel 项目设置中注入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 等（不要在仓库中提交密钥）。

### 7.2 Supabase 部署

- 数据库：通过 `supabase/migrations/*` 管理 schema 与策略。
- Storage：bucket 与 policy 在迁移中声明。
- Edge Functions：通过 Supabase 部署，并在 Supabase 后台配置 secrets（微信、AI 等第三方密钥）。

## 8. 已知风险清单（需要产品/技术共同确认）

- 安全：`leads` 的匿名读取策略与“线索隐私”目标可能冲突，需要修订 RLS。
- 密钥：部分 Edge Function 存在硬编码第三方密钥，应立刻迁移到环境变量并轮换。
- 分享配置：对动态路由的 `share_configs` 依赖精确 path，覆盖不足（影响运营配置效率）。
- 权限体系：前端“分享锁”目前是模拟机制，与数据库/会员体系未闭环（需明确业务口径后再实现）。

