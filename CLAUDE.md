# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目专用规则：PLAN和极简

### 1. PLAN模式

1. 首先给出一个完善全面的计划，并且询问用户是否满意，再进行编码。
2. 执行任务时有任何疑问可以反问我，不着急编码

### 2. 语法要求

代码只会用于快速原型开发，不会用于生产环境。可以为了代码简洁而牺牲防御性功能。

---

## 项目概述

**NewImg** - 百万级手绘素材库管理系统（DAM），面向独立创作者的数字资产管理工具。

**当前状态**: 早期规划阶段，已完成 Supabase 本地环境搭建

- 数据规模：100万张 512x512 素描风格手绘素材
- 核心功能：基于 PostgreSQL GIN 索引的多维分面搜索、虚拟滚动瀑布流
- 设计理念：Serverless优先 + 边缘计算 + 极致成本控制（月成本 < $60）

## 技术栈（规划）

| 模块 | 技术选型 |
|------|---------|
| 前端框架 | Next.js 15 (App Router) + React Server Components |
| UI | Tailwind CSS 3 + Shadcn/ui |
| 数据库 | Supabase (PostgreSQL + JSONB + GIN索引) |
| 对象存储 | Cloudflare R2（零出口费用） |
| 虚拟滚动 | react-window + Masonic |
| 状态管理 | URL Parameters（无Redux） |
| AI标签清洗 | OpenRouter (DeepSeek-V3) |
| 部署 | Vercel |

## 项目结构

```
imgweb/
├── docs/                              # 📚 文档中心
│   ├── design/                        # 架构设计文档
│   │   ├── README.md                  # 项目完整说明
│   │   ├── FRONTEND_TECHNICAL_DESIGN.md
│   │   ├── TECH_STACK_COMPARISON.md
│   │   └── *.txt                      # 其他设计文档
│   └── progress/                      # 项目进度追踪
│       ├── progress.txt               # 总体进度（需持续更新）
│       └── {module}_task.txt          # 子模块设计文档
│
├── dev/                               # 🔧 本地开发环境
│   ├── guides/                        # 本地开发指南
│   │   └── SUPABASE_INSTALL_GUIDE.md
│   └── scripts/                       # 本地测试脚本
│       ├── simple-test.js
│       └── test-supabase.js
│
├── deploy/                            # 🚀 远程部署
│   └── resources/                     # 远程服务器资源（密钥等）
│
├── prototypes/                        # 🎨 UI原型/Demo
│   ├── index1.html                    # 首页原型
│   └── 2.html
│
├── src/                               # 💻 源代码（待创建）
│
├── supabase/                          # 🗄️ Supabase配置（待创建）
│
└── CLAUDE.md                          # 本文件
```

## 当前可用命令

### Supabase 本地开发环境

```bash
# 启动 Supabase 本地服务
npx supabase start

# 停止服务
npx supabase stop

# 查看服务状态
npx supabase status

# 重置数据库
npx supabase db reset
```

### 测试 Supabase 连接

```bash
# 测试本地 Supabase 服务
node dev/scripts/simple-test.js

# 测试 Supabase JS 客户端连接
node dev/scripts/test-supabase.js
```

### Supabase 本地服务端点

- **Studio 界面**: http://127.0.0.1:54323
- **API 网关**: http://127.0.0.1:54321
- **数据库**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **公开密钥**: `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH`

## 规划中的架构

```
用户请求 → Cloudflare CDN → Vercel Edge → Supabase (PostgreSQL) → Cloudflare R2
```

### 数据库核心表（待实现）
- `assets`: 图片资源表，`tags` 字段为 JSONB + GIN索引，支持毫秒级标签查询
- `asset_stats`: 统计表（浏览/下载/收藏）
- `user_favorites`: 用户收藏关系
- `tag_counts`: 标签计数缓存（触发器维护）

### 关键查询模式
```sql
-- 多标签筛选（GIN索引，100万行 < 10ms）
WHERE tags @> '["sketch", "action"]'::jsonb
```

## 项目进度管理

这是一个长期项目，包含多个子模块。使用 `docs/progress/` 文件夹统一管理进度和子模块设计。

### 进度文件

- **[docs/progress/progress.txt](docs/progress/progress.txt)** - 总体进度记录
  - 记录已完成的里程碑和当前工作状态
  - **重要**: 每完成一个阶段性任务，必须更新此文件

### 子模块设计文档

每个子模块的详细设计单独存放，命名规范：`{模块名}_task.txt`

| 文件 | 模块说明 |
|------|---------|
| `index1_task.txt` | 首页设计 - T型导航、货架式布局、拖拽采集 |
| `search_task.txt` | 搜索模块（待创建） |
| `upload_task.txt` | 上传模块（待创建） |
| ... | 后续按需添加 |

### 维护规范

1. **完成任务后**: 更新 `docs/progress/progress.txt`，记录完成内容
2. **开始新模块前**: 先在 `docs/progress/` 下创建 `{module}_task.txt`
3. **设计文档内容**: 包含功能描述、交互逻辑、UI 设计要点、技术实现方案

## 核心文档索引

| 类别 | 文档 | 说明 |
|------|------|------|
| **进度** | [docs/progress/progress.txt](docs/progress/progress.txt) | 当前项目进度 |
| **设计** | [docs/design/README.md](docs/design/README.md) | 项目完整说明 |
| **设计** | [docs/design/FRONTEND_TECHNICAL_DESIGN.md](docs/design/FRONTEND_TECHNICAL_DESIGN.md) | 前端架构设计 |
| **设计** | [docs/design/TECH_STACK_COMPARISON.md](docs/design/TECH_STACK_COMPARISON.md) | 技术栈选型 |
| **本地开发** | [dev/guides/SUPABASE_INSTALL_GUIDE.md](dev/guides/SUPABASE_INSTALL_GUIDE.md) | Supabase 安装指南 |
