# NewImg - 百万级手绘素材库管理系统

> 一个面向独立创作者的高性能数字资产管理（DAM）系统，专为百万级手绘素材的快速检索和流畅浏览而设计。

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Cloudflare R2](https://img.shields.io/badge/Storage-Cloudflare_R2-orange)](https://www.cloudflare.com/products/r2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 项目简介

NewImg 是一个专为**百万级手绘素材库**设计的现代化数字资产管理系统，核心特性包括：

- 🎯 **智能标签筛选**: 基于 PostgreSQL GIN 索引的多维分面搜索，毫秒级响应
- ⚡ **极致性能**: React Server Components + 虚拟滚动，流畅浏览数千张图片
- 💰 **超低成本**: Serverless 架构 + Cloudflare R2 零出口费用，月成本 < $60
- 🔍 **SEO 优化**: 百万级页面的搜索引擎友好架构
- 🎨 **优雅交互**: "所见即所得"的动态计数 + 瀑布流布局

### 项目背景

管理 **100万张** 512x512 分辨率、统一风格（素描）的手绘素材，涵盖：
- 单人/双人/多人动作姿势
- 古代/现代场景
- 职业角色（剑士、法师、医生等）
- 特定视角（俯视、仰视、鱼眼等）
- 灵感排版（漫画排版、封面排版等）

**核心挑战**:
- 如何在海量数据中快速定位所需素材？
- 如何控制独立创作者的运营成本？
- 如何在低成本下保持流畅的用户体验？

---

## ✨ 核心特性

### 1. 🔍 多维分面筛选系统（Faceted Search）

```
侧边栏筛选器
├── 📁 人物类型
│   ├── ☑ 单人动作 (15,234)
│   ├── ☐ 双人动作 (3,456)
│   └── ☐ 多人动作 (1,289)
├── 📁 场景类型
│   ├── ☐ 古代场景 (8,901)
│   └── ☐ 现代场景 (12,345)
└── 📁 视角
    ├── ☐ 俯视 (5,678)
    └── ☐ 仰视 (3,456)
```

**核心功能**:
- ✅ **动态计数**: 选择"双人动作"后，"古代场景"计数实时更新
- ✅ **点击式筛选**: 无需输入关键词（Less Prompting）
- ✅ **可分享链接**: URL 即状态，收藏/分享筛选结果

### 2. ⚡ 极致性能优化

- **React Server Components (RSC)**: 服务端渲染，减少客户端 JS 40-50%
- **虚拟滚动 (Masonic)**: 仅渲染视口可见的 20-30 张图片，内存占用降低 70-80%
- **GIN 索引查询**: 百万级数据查询响应 < 10ms
- **WebP 图片**: 体积减少 60-70%
- **CDN 边缘缓存**: Cloudflare 全球节点，1年缓存

### 3. 💰 极低运营成本

| 项目 | 服务 | 月成本 |
|------|------|-------|
| 前端托管 | Vercel Pro | $20 |
| 数据库 + 认证 | Supabase Pro + Compute | $35 |
| 图片存储（100GB） | Cloudflare R2 | $1.50 |
| AI 标签清洗 | OpenRouter | < $5（一次性） |
| **总计** | | **~$57.50/月** |

**对比传统架构**（EC2 + RDS + S3）: 节省约 **95%** 成本

### 4. 🎨 优雅的用户体验

- **瀑布流布局**: 最大化屏幕利用率，响应式列数（手机 1-2 列，桌面 4-6 列）
- **模态框详情页**: 键盘导航（←/→ 切换，ESC 关闭，Space 收藏）
- **关联推荐**: 基于标签 Jaccard 相似度的智能推荐
- **NSFW 内容管理**: 年龄验证 + 高斯模糊预览

---

## 🛠️ 技术栈

### 核心框架
- **Next.js 15 (App Router)**: React Server Components + 混合渲染（SSR/SSG/ISR）
- **TypeScript 5**: 完整的类型安全
- **Tailwind CSS 3 + Shadcn/ui**: 原子化 CSS + 无障碍组件

### 后端与数据库
- **Supabase (PostgreSQL)**: JSONB + GIN 索引 + 行级安全（RLS）
- **Cloudflare R2**: 对象存储（零出口流量费用）
- **OpenRouter API**: AI 标签清洗（DeepSeek-V3 / Llama-3-70B）

### 性能优化
- **react-window + Masonic**: 虚拟滚动 + 瀑布流布局
- **Sharp**: 图片格式转换（WebP）
- **BlurHash**: 占位符生成

### 部署与运维
- **Vercel**: Serverless 部署 + 全球 CDN
- **GitHub Actions**: CI/CD（可选）

**完整技术栈对比**: 见 [TECH_STACK_COMPARISON.md](./TECH_STACK_COMPARISON.md)

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）或 npm >= 9.0.0
- Supabase 账号
- Cloudflare 账号（R2 存储）

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/newimg.git
cd newimg
```

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2 配置
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-r2-domain.com

# OpenRouter API（数据迁移时使用）
OPENROUTER_API_KEY=your-openrouter-key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 初始化数据库

```bash
# 运行 Supabase 迁移脚本（位于 /supabase/migrations）
pnpm supabase db push
```

数据库 Schema 包括：
- `assets`: 图片资源表（含 JSONB 标签 + GIN 索引）
- `asset_stats`: 统计表（浏览量、下载量、收藏量）
- `user_favorites`: 用户收藏关系
- `tag_counts`: 标签计数缓存（触发器维护）

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

---

## 📂 项目结构

```
newimg/
├── app/                     # Next.js App Router
│   ├── page.tsx             # 首页
│   ├── search/              # 搜索页（核心功能）
│   │   ├── page.tsx         # RSC 服务端渲染
│   │   └── components/      # 图片画廊、筛选器等组件
│   ├── asset/[id]/          # 图片详情页（ISR）
│   └── api/                 # API Routes（上传、统计等）
├── components/              # 公共组件
│   ├── ui/                  # Shadcn/ui 组件
│   └── ImageModal.tsx       # 图片详情模态框
├── lib/                     # 工具函数和配置
│   ├── supabase/            # Supabase 客户端
│   ├── r2/                  # R2 上传工具
│   └── utils.ts             # 通用工具
├── hooks/                   # 自定义 Hooks
├── types/                   # TypeScript 类型
├── scripts/                 # 数据迁移脚本
│   ├── migrate.ts           # 批量导入图片
│   └── clean-tags.ts        # AI 标签清洗
├── supabase/                # Supabase 配置
│   └── migrations/          # 数据库迁移文件
├── docs/                    # 文档
│   ├── FRONTEND_TECHNICAL_DESIGN.md   # 技术架构设计
│   └── TECH_STACK_COMPARISON.md       # 技术栈选型对比
└── plan/                    # 原始需求文档
    ├── plan.txt             # 详细架构设计方案
    └── planreview.txt       # 技术评审报告
```

---

## 📊 数据迁移

### 场景

您有 100万张本地图片（`image_01.png`, `image_02.png` ...）和对应的标签文件（`image_01.txt`, `image_02.txt` ...）。

### 步骤

#### 1. AI 标签清洗（推荐）

```bash
# 提取所有唯一标签并清洗
pnpm run clean-tags
```

脚本逻辑：
1. 扫描所有 `.txt` 文件，提取唯一标签（去重）
2. 调用 OpenRouter API（DeepSeek-V3），批量清洗：
   - 纠正拼写错误
   - 统一中英文
   - 归并同义词（如 "女孩" → "女性"）
   - 按维度分类（动作/视角/风格）
3. 生成 `tag_mapping.json`（原始标签 → 清洗后标签）

**成本**: 约 $3-5（一次性）

#### 2. 批量导入图片

```bash
# 上传图片至 R2 并写入 Supabase
pnpm run migrate --source ./local-images --concurrency 10
```

脚本逻辑：
1. 遍历本地图片文件夹
2. 使用 Sharp 转换为 WebP（80% 质量）
3. 计算 SHA-256 哈希，检查是否已存在
4. 并发上传至 Cloudflare R2
5. 读取对应的 `.txt` 标签文件，应用清洗映射
6. 写入 Supabase `assets` 表

**性能**: 10 并发约 1000 张/小时（取决于带宽）

---

## 🎯 核心功能使用

### 搜索与筛选

```
URL: /search?tags=sketch,action&category=poses&page=2
```

- **tags**: 多标签筛选（逗号分隔）
- **category**: 一级分类ID
- **page**: 分页页码
- **nsfw**: 是否显示敏感内容（需登录 + 年龄验证）

### 图片详情

```
URL: /asset/12345
```

- 模态框展示高清原图
- 键盘导航：`←/→` 切换，`ESC` 关闭，`Space` 收藏
- 关联推荐：基于标签相似度

### 用户收藏

```tsx
// 使用 Supabase Client SDK
const { data, error } = await supabase
  .from('user_favorites')
  .insert({ user_id: userId, asset_id: assetId })
```

---

## 🔧 开发指南

### 数据库查询示例

#### 1. 多标签筛选

```sql
SELECT id, storage_key, tags, created_at
FROM assets
WHERE tags @> '["sketch", "action"]'::jsonb
  AND is_nsfw = false
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;
```

#### 2. 分面计数

```sql
-- 获取当前筛选条件下，各分类的数量
SELECT category_id, COUNT(*) as count
FROM assets
WHERE tags @> '["sketch"]'::jsonb
GROUP BY category_id;
```

#### 3. 标签聚合

```sql
-- 使用物化视图缓存（定时刷新）
CREATE MATERIALIZED VIEW tag_counts_mv AS
SELECT jsonb_array_elements_text(tags) AS tag, COUNT(*) as count
FROM assets
GROUP BY tag;

REFRESH MATERIALIZED VIEW tag_counts_mv;
```

### 性能优化建议

1. **启用 GIN 索引**:
   ```sql
   CREATE INDEX idx_assets_tags ON assets USING GIN (tags);
   ```

2. **使用物化视图缓存聚合结果**（分面计数）

3. **启用 PostgreSQL 查询缓存**（Supabase 自动管理）

4. **图片 CDN 缓存**:
   ```
   Cache-Control: public, max-age=31536000, immutable
   ```

---

## 🧪 测试

### 单元测试

```bash
pnpm test
```

### E2E 测试（Playwright）

```bash
pnpm test:e2e
```

### 性能测试

```bash
# 测试虚拟滚动性能
pnpm test:performance
```

---

## 🚢 部署

### Vercel 部署（推荐）

1. **连接 GitHub 仓库**:
   - 登录 Vercel，导入项目
   - 自动检测 Next.js 配置

2. **配置环境变量**:
   - 在 Vercel Dashboard 添加 `.env.local` 中的所有变量

3. **部署**:
   ```bash
   git push origin main
   # Vercel 自动构建并部署
   ```

### 自定义域名

1. 在 Vercel Dashboard 添加自定义域名
2. 配置 DNS（CNAME 指向 Vercel）
3. 自动启用 HTTPS（Let's Encrypt）

### 性能监控

- **Vercel Analytics**: 自动启用
- **Supabase Dashboard**: 查询性能监控
- **Cloudflare Analytics**: R2 访问统计

---

## 📈 扩展性规划

### 数据量扩展

| 数据量 | 方案 | 成本变化 |
|--------|------|---------|
| 100万 | 当前配置 | ~$57.50/月 |
| 1000万 | Supabase Pro + 更大实例 | ~$85/月 |
| 1亿+ | 分表 + 读写分离 | ~$200/月 |

### 功能扩展

- [ ] **以图搜图**: 集成 PostgreSQL pgvector + CLIP 模型
- [ ] **付费会员**: Stripe 集成
- [ ] **AI 生成标签**: 对新上传图片自动打标签
- [ ] **社交功能**: 用户评论、点赞
- [ ] **批量下载**: ZIP 打包下载

---

## 🤝 贡献指南

欢迎贡献代码、报告 Bug 或提出新功能建议！

### 开发流程

1. Fork 项目
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: 新功能
fix: 修复 Bug
perf: 性能优化
refactor: 重构
docs: 文档更新
chore: 构建/工具链
```

---

## 📜 许可证

本项目采用 [MIT License](LICENSE)。

---

## 📚 相关文档

- [前端技术框架设计方案](./FRONTEND_TECHNICAL_DESIGN.md) - 详细的架构设计
- [技术栈选型对比分析](./TECH_STACK_COMPARISON.md) - 为何选择 Next.js + Supabase + R2
- [原始需求文档](./plan/plan.txt) - 百万级素材库架构设计报告
- [技术评审报告](./plan/planreview.txt) - 2025 年技术栈最佳实践

---

## 🙏 致谢

本项目的技术方案灵感来源于：
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase GIN Index Guide](https://supabase.com/docs/guides/database/json#indexing-jsonb-columns)
- [Cloudflare R2 Architecture](https://developers.cloudflare.com/r2/)
- [Masonic Virtual Masonry](https://github.com/jaredLunde/masonic)

---

## 📧 联系方式

- **项目地址**: [GitHub Repository](https://github.com/yourusername/newimg)
- **问题反馈**: [Issues](https://github.com/yourusername/newimg/issues)
- **讨论社区**: [Discussions](https://github.com/yourusername/newimg/discussions)

---

**Built with ❤️ by Independent Creators, for Independent Creators.**
