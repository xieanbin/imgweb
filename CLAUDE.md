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

- 数据规模：100万张 512x512 素描风格手绘素材
- 核心功能：基于 PostgreSQL GIN 索引的多维分面搜索、虚拟滚动瀑布流
- 设计理念：Serverless优先 + 边缘计算 + 极致成本控制（月成本 < $60）

## 技术栈

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

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 数据库迁移
pnpm supabase db push

# AI标签清洗（一次性）
pnpm run clean-tags

# 批量导入图片
pnpm run migrate --source ./local-images --concurrency 10

# 测试
pnpm test           # 单元测试
pnpm test:e2e       # E2E测试 (Playwright)
```

## 核心架构

```
用户请求 → Cloudflare CDN → Vercel Edge → Supabase (PostgreSQL) → Cloudflare R2
```

### 数据库核心表
- `assets`: 图片资源表，`tags` 字段为 JSONB + GIN索引，支持毫秒级标签查询
- `asset_stats`: 统计表（浏览/下载/收藏）
- `user_favorites`: 用户收藏关系
- `tag_counts`: 标签计数缓存（触发器维护）

### 关键查询模式
```sql
-- 多标签筛选（GIN索引，100万行 < 10ms）
WHERE tags @> '["sketch", "action"]'::jsonb
```

## 项目结构（规划中）

```
newimg/
├── app/                    # Next.js App Router
│   ├── search/             # 搜索页（RSC服务端渲染）
│   ├── asset/[id]/         # 详情页（ISR增量静态生成）
│   └── api/                # API Routes
├── components/             # 公共组件 + Shadcn/ui
├── lib/                    # Supabase/R2 客户端
├── scripts/                # 数据迁移脚本
└── plan/                   # 技术设计文档
```

## 关键设计文档

- [plan/README.md](plan/README.md) - 项目完整说明
- [plan/FRONTEND_TECHNICAL_DESIGN.md](plan/FRONTEND_TECHNICAL_DESIGN.md) - 前端架构设计
- [plan/TECH_STACK_COMPARISON.md](plan/TECH_STACK_COMPARISON.md) - 技术栈选型分析
