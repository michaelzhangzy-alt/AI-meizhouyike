# CONTENT_MAP（全站内容地图 / 信息架构）

本文档用于“通读全站”：把每个页面是什么、数据从哪里来、如何展示、从哪里进入、能跳到哪里、有哪些无需改代码即可配置的项，统一成一张地图，便于交接与验收。

## 1. 全站页面地图

### 1.1 前台（Public）

| 路由 | 页面 | 用途（用户视角） | 核心动作 |
|---|---|---|---|
| `/` | Console 主页 | Console 风格入口与快速导航 | 跳转到 `/home`、`/weekly-class`、`/news`、`/about` |
| `/home` | 首页 | 品牌展示 + 内容推荐 + 快速留资 | 查看推荐课程/资讯；报名留资 |
| `/weekly-class` | 本周公开课 | 查看近期课程（含最近/未来） | 报名留资 |
| `/courses` | 课程列表 | 浏览课程；按系列筛选 | 进入课程详情；报名留资 |
| `/courses/:id` | 课程详情 | 查看单课详情 | 报名留资 |
| `/news` | 资讯列表 | 浏览 AI 资讯；按类型筛选 | 进入资讯详情 |
| `/news/:id` | 资讯详情 | 阅读文章；外链导读；上下篇 | 增加阅读量；跳转外链 |
| `/about` | 关于我们 | 展示品牌介绍与会员权益 | 无 |
| `/ai-tools` | AI 工具首页 | AI 工具导航与营销页 | 进入工具详情 |
| `/ai-tools/:slug` | AI 工具详情 | Markdown 内容页 + 部分工具交互 | 运行特定工具组件 |
| `/ai-tools/fortune` | AI 算命 | 流式 AI 交互工具 | 调用 Edge Function（流式） |

### 1.2 后台（Admin CMS）

| 路由 | 页面 | 用途（运营视角） | 核心动作 |
|---|---|---|---|
| `/admin/login` | 登录 | 管理员登录 | Supabase Auth 登录 |
| `/admin` / `/admin/dashboard` | 仪表盘 | 关键数据概览 | 统计近 7 天线索、发布课程/文章数 |
| `/admin/leads` | 报名管理 | 线索查看与导出 | 列表查询；导出 XLSX |
| `/admin/members` | 付费会员 | 付费名单与群二维码管理 | CRUD paid_members；上传/删除群二维码 |
| `/admin/teachers` | 师资管理 | 师资 CRUD | 列表/编辑 |
| `/admin/teachers/new` | 师资编辑 | 新建 | 保存 |
| `/admin/teachers/edit/:id` | 师资编辑 | 编辑 | 保存 |
| `/admin/courses` | 课程管理 | 课程 CRUD | 列表/编辑 |
| `/admin/courses/new` | 课程编辑 | 新建 | 保存 |
| `/admin/courses/edit/:id` | 课程编辑 | 编辑 | 保存 |
| `/admin/articles` | 资讯管理 | 文章 CRUD | 列表/编辑 |
| `/admin/articles/new` | 资讯编辑 | 新建 | 保存 |
| `/admin/articles/edit/:id` | 资讯编辑 | 编辑 | 保存 |
| `/admin/share-config` | 分享配置 | 微信分享卡片按路径配置 | CRUD share_configs |
| `/admin/site-config` | 站点内容 | 页面碎片（关于我们/会员权益）配置 | CRUD page_fragments |

## 2. 关键公共组件与全局能力

### 2.1 前台布局与“报名留资”入口

- 布局容器：`PublicLayout` 统一挂载 `Navbar/Footer/MobileNav/LeadModal`。
- 报名弹窗：`LeadModal` 由 `PublicLayout` 持有状态，通过 `Outlet context` 下发 `handleRegister(source, course?)` 给各页面调用。
- 典型入口：
  - Navbar 顶部“立即报名”
  - `/weekly-class` 课程卡片“立即报名”
  - `/courses/:id` 详情页主按钮“立即免费报名”
  - 首页的转化区块（快速留资）

### 2.2 微信分享（JS-SDK）

- App 启动后全局启用 `useWeChatShare()`，每次路由变化会：
  1)（非 localhost）调用 Edge Function `wechat-signature` 获取签名；
  2) 读取数据库 `share_configs` 中与 `location.pathname` 匹配且 `is_active=true` 的配置；
  3) 调用 `wx.updateAppMessageShareData` / `wx.updateTimelineShareData` 设置分享卡片。

### 2.3 前端缓存（5 分钟）

`useCacheStore` 提供 `news/courses/weeklyClasses` 三级缓存，当前主要用于“无筛选的默认列表页”减小重复请求。

## 3. 页面级内容说明（数据来源 / 展示逻辑 / 入口 / 跳转 / 可配置项）

### 3.1 `/` Console 主页

- 数据来源：无（纯前端交互）。
- 展示逻辑：ConsoleUI 命令式交互，内置快捷跳转链接。
- 入口：站点根路径。
- 跳转：`/home`、`/weekly-class`、`/news`、`/about`。
- 可配置项：无（若需要运营可配，建议后续接入 `page_fragments`）。

### 3.2 `/home` 首页

- 数据来源（读）：
  - `courses`：取 `status='published'` 最新 3 条（首页精选课程）。
  - `articles`：取 `status='published'` 最新 3 条（首页精选资讯）。
- 数据来源（写）：
  - `leads`：转化区块可直接插入线索（简化留资）。
- 展示逻辑：
  - Hero/快捷入口/精选内容/转化区块。
  - 点击“报名/领取资料”等触发 `LeadModal`。
- 入口：Navbar、Console 主页。
- 跳转：课程详情、资讯详情、本周公开课等。
- 可配置项：微信分享卡片（`share_configs` 里配置 `/home`）。

### 3.3 `/weekly-class` 本周公开课

- 数据来源（读）：
  - `courses`：取 `status='published'`，时间窗口（过去 14 天 ~ 未来 30 天），最多 10 条。
- 展示逻辑：按时间展示课程卡片；未结束课程可报名。
- 入口：Navbar、MobileNav、首页快捷入口。
- 跳转：课程详情；报名弹窗。
- 可配置项：微信分享卡片（`share_configs` 里配置 `/weekly-class`）。

### 3.4 `/courses` 课程列表

- 数据来源（读）：
  - `course_series`：取 `is_active=true` 的系列（用于筛选），按 `sort_order`。
  - `courses`：取 `status='published'`，默认按 `schedule_time` 排序，最多 12 条；支持 `series_id` 过滤（含“未归类”）。
- 展示逻辑：
  - 默认列表命中缓存时不请求。
  - 选择系列筛选后重新请求。
- 入口：Navbar、MobileNav。
- 跳转：课程详情；报名弹窗。
- 可配置项：
  - 系列配置来自 `course_series`（当前后台无管理页面，属于“数据侧可配但 UI 未提供”）。
  - 微信分享卡片（`share_configs` 里配置 `/courses`）。

### 3.5 `/courses/:id` 课程详情

- 数据来源（读）：
  - `courses`：按 id 读取单条（要求 `status='published'`）。
- 展示逻辑：展示课程标题/时间/讲师/亮点/富文本内容等（以表字段为准）。
- 入口：课程列表、首页精选。
- 跳转：报名弹窗。
- 可配置项：微信分享卡片（`share_configs` 里配置 `/courses/:id` 不易精确匹配，通常使用固定路径分享或在代码中做动态匹配策略）。

### 3.6 `/news` 资讯列表

- 数据来源（读）：
  - `articles`：取 `status='published'`，支持 `type` 筛选（all/original/external），列表最多 12 条；轮播/精选最多 5 条。
- 展示逻辑：
  - 默认列表命中缓存时不请求。
  - 根据筛选展示不同 feed 组件（瀑布流/时间线/轮播）。
- 入口：Navbar、MobileNav。
- 跳转：资讯详情。
- 可配置项：微信分享卡片（`share_configs` 里配置 `/news`）。

### 3.7 `/news/:id` 资讯详情

- 数据来源（读）：
  - `articles`：按 id 读取单篇详情。
  - 最近文章：读取 `articles` 最新若干条（侧边栏）。
  - 上一篇/下一篇：按 `created_at` 查询相邻文章。
- 数据来源（写）：
  - RPC：`increment_article_views(article_id)` 增加阅读量（匿名可执行）。
- 展示逻辑：
  - 若 `external_url` 存在：展示“外链导读”模式（含 `external_guide`）。
  - 支持 Markdown/富文本渲染（以字段存储为准）。
- 入口：资讯列表、首页精选。
- 跳转：外链 URL；上一篇/下一篇。
- 可配置项：微信分享卡片（`share_configs` 里配置 `/news/:id` 同样存在路径匹配问题，建议后续支持“前缀匹配/动态生成”）。

### 3.8 `/about` 关于我们

- 数据来源（读）：
  - `page_fragments`：读取 `about_us`（富文本 HTML）与 `member_benefits`（数组/结构化内容）。
- 展示逻辑：有默认兜底内容；后台更新后即生效。
- 入口：Navbar、MobileNav、Console 主页。
- 跳转：无。
- 可配置项：
  - 站点内容（`page_fragments`，后台 `/admin/site-config`）。
  - 微信分享卡片（`share_configs` 里配置 `/about`）。

### 3.9 `/ai-tools` AI 工具首页

- 数据来源：主要为前端静态配置（工具列表定义在本地数据文件）。
- 展示逻辑：工具营销 + 工具列表导航。
- 入口：Navbar、MobileNav。
- 跳转：工具详情页或外链。
- 可配置项：工具清单为代码配置；微信分享卡片（`share_configs` 里配置 `/ai-tools`）。

### 3.10 `/ai-tools/:slug` AI 工具详情（内容页）

- 数据来源：
  - 本地 Markdown：`src/features/ai-tools/content/*.md` 通过 `import.meta.glob(..., '?raw')` 动态加载。
- 展示逻辑：
  - 解析 frontmatter，渲染为详情页。
  - 对特定 slug（例如 `xiaohongshu`）会在内容页挂载交互组件。
- 入口：AI 工具首页。
- 跳转：无（除非内容里写外链）。
- 可配置项：内容需改 Markdown；微信分享卡片可按路径配置（`/ai-tools/<slug>` 存在路径匹配问题，建议前缀/动态策略）。

### 3.11 `/ai-tools/fortune` AI 算命（流式）

- 数据来源（写/算力）：
  - 通过 `fetch` 调用 Supabase Edge Function `fortune-teller`（SSE 流式转发）。
- 展示逻辑：使用 `eventsource-parser` 解析 SSE 并做“打字机”效果。
- 入口：AI 工具首页/详情页跳转。
- 跳转：无。
- 可配置项：无（bot_id 等参数目前写在前端）。

## 4. 后台页面说明（数据来源 / 展示逻辑 / 可配置项）

### 4.1 登录与权限

- `/admin/login`：使用 Supabase Auth 的 `signInWithPassword` 登录。
- `/admin/*`：`AdminLayout` 检测 session；无 session 强制跳转登录页。

### 4.2 内容与运营配置

- 课程管理：`courses`（封面图上传到 Storage `course-covers`）。
- 资讯管理：`articles`（封面/分享图可用 Storage）。
- 师资管理：`teachers`（图片上传到 Storage）。
- 分享配置：`share_configs`（按 `page_path` 管理）。
- 站点内容：`page_fragments`（目前 UI 重点管理 `about_us`、`member_benefits`）。
- 线索管理：`leads`（支持导出 XLSX）。
- 付费会员与群二维码：
  - `paid_members`：后台维护老付费用户名单。
  - `wechat_group_qr`：后台维护可展示的群二维码信息（含图片 storage）。

## 5. 关键业务链路（端到端）

### 5.1 报名留资（核心转化链路）

1) 用户在前台任一入口点击“报名/领取资料”。  
2) 打开 `LeadModal` 填写姓名 + 手机号。  
3) 提交时优先调用 RPC `submit_lead`：
   - 写入 `leads`；
   - 匹配 `paid_members` 判定是否“老付费用户”，必要时返回 `wechat_group_qr` 信息。  
4) 若 RPC 不存在/失败，fallback 为直接 `leads.insert`。

### 5.2 内容发布（后台运营链路）

1) 管理员登录后台。  
2) 在课程/资讯/师资模块进行新增或编辑。  
3) 发布状态由表字段控制（前台只读取 `status='published'` 内容）。

### 5.3 微信分享配置（运营链路）

1) 管理员在 `/admin/share-config` 为指定 `page_path` 配置分享 title/description/image_url 并启用。  
2) 线上环境用户打开页面时，前端自动拉取配置并设置微信分享卡片。

## 6. 现状差异与待补齐项（影响交付验收的点）

- 报名成功页的二维码展示目前为占位图；虽然 RPC 可能返回二维码信息，但 UI 未使用返回值进行渲染。
- `share_configs` 以“精确路径匹配”为主；对 `/news/:id`、`/courses/:id`、`/ai-tools/:slug` 这类动态路由难以覆盖，建议引入“前缀匹配/动态生成策略”。
- “分享锁”能力当前为前端模拟解锁，与 `paid_members`/RLS 未形成闭环（如需作为正式权限体系，需要产品与技术一起定口径）。

