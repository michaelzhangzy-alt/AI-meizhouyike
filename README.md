# unixtech-xyz (v1.0.0)

> **"公开课引流 + 内容沉淀 + AI 效率工具 + 后台运营提效" 的一体化教育官网平台。**

![Status](https://img.shields.io/badge/Status-Production%20Ready-green) ![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Supabase%20%7C%20Coze-blue)

## 🌟 核心功能亮点

### 🤖 AI 智能体矩阵 (New in v1.0)
集成了 Coze V3 智能体能力，通过 **Proxy Stream + Eventsource Parser** 架构实现企业级流式体验。
*   **科学算运势**：输入生辰八字，AI 实时推演流年运势，支持打字机效果，零延迟、无乱码。
*   **小红书爆款文案**：输入主题与关键词，自动生成 Emoji 丰富、语气活泼的种草文案，一键复制。

### 🎨 视觉体验升级 (Minimalist Cyber)
*   **简约极客风**：全站 UI 重构，采用清爽的紫色/红色/蓝色调区分不同板块。
*   **移动端适配**：精心打磨的响应式布局，在手机端也能获得原生 App 般的体验。

### 📚 内容生态系统
*   **公开课/直播课**：支持往期回放、本周直播预告、自动跳转最近课程。
*   **AI 资讯**：支持富文本文章展示，独创“外链导读”模式，无缝跳转外部优质资源。

### ⚙️ 运营中台 (Admin CMS)
*   **线索管理**：实时查看报名数据，支持 Excel 一键导出。
*   **内容发布**：所见即所得的富文本编辑器（TinyMCE），支持图片裁剪与上传。
*   **微信分享**：按页面路径动态配置分享卡片（标题/描述/图片），无需开发介入。

---

## 🛠 技术架构

### 前端 (Frontend)
*   **框架**：React 18 + Vite
*   **语言**：TypeScript
*   **样式**：TailwindCSS + Framer Motion
*   **状态**：Zustand
*   **AI 流处理**：`eventsource-parser`

### 后端 (Backend as a Service)
*   **服务**：Supabase
*   **数据库**：Postgres (启用 RLS 行级安全策略)
*   **存储**：Supabase Storage (图片资源)
*   **计算**：Edge Functions (Deno) - 处理 AI 代理与微信签名

---

## 🚀 快速开始

### 1. 环境准备
确保本地已安装 Node.js (v18+) 和 Git。

### 2. 安装依赖
```bash
git clone https://github.com/your-repo/unixtech-xyz.git
cd unixtech-xyz
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env`，并填入 Supabase 公钥：
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 启动开发服务器
```bash
npm run dev
```
访问 `http://localhost:5173` 查看前台，访问 `/admin/login` 进入后台。

---

## 📂 目录结构说明

```bash
src/
├── features/           # 🤖 核心业务模块
│   └── ai-tools/       # AI 工具箱 (FortuneTeller, Xiaohongshu...)
├── components/         # 🧩 通用组件
│   ├── ui/             # 基础 UI 库 (Button, Card, Input...)
│   └── layout/         # 布局组件
├── pages/              # 📄 页面路由
│   ├── admin/          # 后台管理页
│   └── ...             # 前台展示页
└── lib/                # 🛠 工具函数 (supabase client)

supabase/
├── functions/          # ⚡ Edge Functions (后端逻辑)
│   ├── fortune-teller/ # 通用 AI 代理接口 (Stable)
│   └── ...
└── migrations/         # 🗄 数据库变更记录
```

## 🔒 安全说明

*   **API Key 保护**：所有第三方 API Key (Coze, WeChat) 均存储在后端环境变量中，前端无法获取。
*   **数据权限**：
    *   `leads` 表：允许匿名写入（报名），严禁匿名读取。
    *   `paid_members` 表：仅后台登录用户可读写。

## 📦 部署指南

本项目针对 **Vercel** 进行了优化配置：
1.  将代码推送到 GitHub。
2.  在 Vercel 中导入仓库。
3.  在 Vercel Settings 中配置环境变量 (`VITE_SUPABASE_...`)。
4.  点击 Deploy，即可自动构建上线。

---

## 📝 版本日志
详见 [CHANGELOG.md](./CHANGELOG.md)
*   **v1.0.0**: AI 智能体全面稳定版 (Current)
*   **v0.8.0**: AI 工具箱上线
*   **v0.5.0**: MVP 发布
