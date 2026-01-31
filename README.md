# unixtech-xyz

公开课引流 + 内容沉淀 + 后台运营提效的一体化官网。

## 功能概览

### 前台
- 首页：本周公开课（主推 + 预告）、师资展示、弹窗留资报名
- 往期课程：列表页 `/courses`、详情页 `/courses/:id`（支持回放/直播状态展示）
- AI 资讯：列表页 `/news`、详情页 `/news/:id`（富文本渲染、上一篇/下一篇、侧栏推荐）
- 关于我们：后台可配置的文案与会员权益 + 发展历程时间轴

### 后台（`/admin`）
- 仪表盘：关键指标 + 最近报名动态
- 报名管理：列表查看、搜索、导出 Excel
- 课程管理：新增/编辑/发布/下架，封面本地上传
- 资讯管理：富文本编辑（表格/图片/颜色/一键排版），封面上传/从正文选择并裁剪，SEO 字段
- 分享配置：按页面路径配置微信分享标题/描述/图片（支持本地上传），并内置使用指南
- 师资管理：讲师 CRUD，头像上传与裁剪
- 站点内容：关于我们文案、会员权益动态维护
- 会员与社群：付费会员名单导入、微信群二维码配置

## 技术栈

- React 18 + Vite + TypeScript
- TailwindCSS
- Supabase（Postgres / Auth / Storage / Edge Functions）
- 富文本：TinyMCE（`@tinymce/tinymce-react`）
- 其他：zustand、xlsx、dompurify、react-easy-crop、framer-motion

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 配置环境变量（项目根目录 `.env`）

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

3. 启动开发服务器

```bash
npm run dev
```

打开：
- 前台：`http://localhost:5173/`
- 后台登录：`http://localhost:5173/admin/login`

## Supabase 说明

### 数据库迁移

本项目使用 `supabase/migrations` 管理数据库结构（课程、资讯、分享配置、讲师、站点内容、会员等）。

### Storage 桶

- `course-covers`：课程/编辑器图片等
- `share-images`：微信分享图、讲师头像等
- `wechat-groups`：微信群二维码

### Edge Functions

- `wechat-signature`：生成微信 JS-SDK 签名（线上域名环境使用）
- `submit-lead`：报名写入与通知（目前可选，前台默认直连写入 leads）

需要在 Supabase 后台为 `wechat-signature` 配置环境变量：

- `WECHAT_APP_ID`
- `WECHAT_APP_SECRET`

## 微信分享如何生效

- 本地 `localhost` 无法完整验证微信 JS-SDK（项目里已对本地做了跳过处理）。
- 必须部署到正式域名，并在微信公众号后台配置“JS接口安全域名”。

## 文档

PRD 与技术架构文档位于：
- `.trae/documents/PRD_培训机构官网_阶段1_MVP.md`
- `.trae/documents/技术架构_培训机构官网_阶段1_MVP.md`
- `.trae/documents/PRD_培训机构官网_阶段2_运营提效.md`
- `.trae/documents/技术架构_培训机构官网_阶段2_运营提效.md`
- `.trae/documents/PRD_培训机构官网_整体.md`
- `.trae/documents/技术架构_培训机构官网_整体.md`

## 已知限制

- 从飞书/部分平台复制整段图文时，图片可能因鉴权/防盗链无法显示；建议图片用截图粘贴或本地上传。
- `leads` 表目前允许匿名写入（为快速上线）；正式上线前建议收紧为“匿名仅插入、禁止匿名读取”，并将写入迁移到 `submit-lead` Edge Function。
