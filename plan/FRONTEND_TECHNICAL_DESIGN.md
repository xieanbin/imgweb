# 百万级手绘素材库前端技术框架设计方案

## 项目概述

**项目名称**: NewImg - 百万级手绘素材库管理系统
**项目定位**: 面向独立创作者的数字资产管理（DAM）工具
**数据规模**: 100万张 512x512 统一规格素描风格手绘素材
**核心需求**: 基于标签系统的快速检索与流畅浏览体验
**设计日期**: 2025-12-21
**设计理念**: Serverless优先 + 边缘计算 + 极致成本控制

---

## 一、核心技术栈选型

### 1.1 前端框架：Next.js 15 (App Router)

**选择理由**:
- **React Server Components (RSC)**: 在服务端直接连接数据库获取数据，减少客户端 JS 包体积 40-50%
- **混合渲染策略**: SSR(动态搜索结果) + SSG(静态页面) + ISR(详情页)
- **SEO 优化**: 百万级页面需要优秀的搜索引擎收录能力
- **Vercel 部署**: 边缘网络分发，全球加载速度优化
- **成熟生态**: 丰富的插件和社区支持

**核心优势**:
- 首屏加载时间（FCP）提升 30-50%
- 自动代码分割和优化
- 内置图片优化支持（可选择性使用）

### 1.2 UI 框架：Tailwind CSS 3.x + Shadcn/ui

**选择理由**:
- **Tailwind CSS**:
  - 原子化 CSS，极致的开发效率
  - 按需构建，生产包体积极小
  - 响应式设计内置支持（Mobile-First）
  - 与 AI 代码生成工具（v0.dev、Cursor）完美配合
- **Shadcn/ui**:
  - 基于 Radix UI 的无障碍组件库
  - 组件源码直接复制到项目，完全可控
  - 与 Tailwind 深度集成
  - 轻量级，无运行时开销

**弃用方案**:
- ❌ Ant Design: 包体积大，定制困难，不适合工具类应用
- ❌ Material-UI: 过于重量级，风格固定
- ❌ Bootstrap: 设计过时，灵活性差

### 1.3 数据库：Supabase (PostgreSQL)

**选择理由**:
- **PostgreSQL 核心能力**:
  - **JSONB 数据类型**: 直接存储标签数组 `["sketch", "action", "running"]`
  - **GIN 索引**: 倒排索引，百万级数据查询 < 10ms
  - **无需 Elasticsearch**: 避免额外运维成本和复杂性
- **Supabase 增值服务**:
  - 托管式 PostgreSQL，零运维
  - 内置认证系统（Auth）
  - 行级安全策略（RLS）
  - 实时订阅（Realtime，可选）
  - RESTful API 自动生成

**性能基准**:
- 1000万行数据，GIN 索引查询响应时间 < 10ms
- 分面计数优化后，动态筛选器响应 < 50ms

### 1.4 对象存储：Cloudflare R2

**选择理由**:
- **零出口流量费用**: 这是最核心的决策点
  - AWS S3: $0.09/GB 出口费 + $0.023/GB/月 存储费
  - Cloudflare R2: $0/GB 出口费 + $0.015/GB/月 存储费
  - **成本节省**: 10TB 月流量节省约 $900（80-90%）
- **S3 兼容 API**: 无缝迁移，生态成熟
- **全球 CDN**: Cloudflare 边缘网络，访问速度快
- **不可变缓存**: `Cache-Control: max-age=31536000, immutable`

**存储成本测算**:
- 100万张图片 × 100KB（WebP压缩后）= 100GB
- 月存储费用: 100GB × $0.015 = **$1.5/月**

### 1.5 状态管理：URL Parameters (唯一真理来源)

**选择理由**:
- **URL 即状态**: 所有筛选条件存储在 URL Query 中
  - 示例: `/search?tags=sketch,action&category=poses&page=2`
- **天然优势**:
  - 支持浏览器前进/后退
  - 可分享/收藏的搜索结果链接
  - SEO 友好
  - 服务端可直接读取（RSC）
- **辅助工具**: Nuqs（类型安全的 URL 参数管理库）

**弃用方案**:
- ❌ Redux/Redux Toolkit: 过度工程，增加复杂度
- ❌ Zustand: 不需要客户端全局状态
- ❌ Recoil/Jotai: URL 已足够

### 1.6 虚拟滚动：react-window + Masonic

**选择理由**:
- **核心挑战**: 百万级数据，单次查询可能返回数千张图片
- **解决方案**: 虚拟滚动 - 仅渲染视口可见区域
  - DOM 节点数量维持在常数级别（20-30个）
  - 内存占用减少 70-80%
- **技术选型**:
  - **react-window**: 高性能虚拟滚动基础库
  - **Masonic**: 专为瀑布流（Masonry Layout）设计的虚拟化库
    - 支持可变高度
    - 移动端渲染时间 < 16ms
    - 自动计算列数和间距

**布局策略**:
- **瀑布流布局（Masonry）**: 最大化屏幕利用率，视觉节奏更好
- **CSS 原生支持**: Chrome 110+, Firefox 117+, Safari 17+
- **响应式列数**:
  - 手机: 1-2 列
  - 平板: 3-4 列
  - 桌面: 4-6 列

### 1.7 图片加载优化策略

**方案设计**:
1. **格式转换**: 上传时自动转换为 WebP
   - 工具: Sharp (Node.js)
   - 压缩率: 60-70% 体积减少
2. **懒加载**: 浏览器原生 `loading="lazy"`
   - 仅加载视口前 200px 的图片
3. **占位符**: BlurHash 或平均灰度值
   - 解决快速滚动时的"白屏"问题
4. **CDN 缓存**: Cloudflare R2 + 1年缓存策略
5. **自定义 ImageLoader**: 直接指向 R2，绕过 Next.js 优化层
   - 避免 Vercel 图片优化按量计费

**图片处理工作流**:
```
上传 → Sharp转WebP(80%质量) → SHA-256哈希去重 → 上传R2 → 写入Supabase
```

### 1.8 AI 集成：OpenRouter API

**使用场景**: 数据导入阶段的标签清洗与标准化

**工作流程**:
1. 提取所有唯一标签（去重后约数千个）
2. 批量调用 OpenRouter (DeepSeek-V3 / Llama-3-70B)
3. AI 任务:
   - 纠正拼写错误
   - 统一中英文
   - 归并同义词（如 "女孩" → "女性"）
   - 按维度分类（动作/视角/风格）
4. 生成 `原始标签 → 清洗后标签` 映射表
5. 批量回写数据库

**成本控制**:
- DeepSeek-V3: ~$0.10-0.14 / 百万输入 tokens
- 处理数千标签预计成本 < **$5**（一次性）

---

## 二、核心功能模块设计

### 2.1 用户体验设计哲学："从搜索到发现"

**设计原则**:
- **视觉优先**: 图片是第一语言，文字次之
- **少提示词（Less Prompting）**: 点击式筛选，而非输入关键词
- **所见即所得**: 动态计数，实时反馈筛选结果
- **心流保持**: 详情页模态框 + 键盘快捷键切换

### 2.2 多维分面筛选系统（Faceted Search）

**交互设计**:

```
侧边栏筛选器（Desktop）/ 底部抽屉（Mobile）
├── 一级维度
│   ├── 📁 人物类型
│   │   ├── ☑ 单人动作 (15,234)
│   │   ├── ☐ 双人动作 (3,456)
│   │   └── ☐ 多人动作 (1,289)
│   ├── 📁 场景类型
│   │   ├── ☐ 古代场景 (8,901)
│   │   └── ☐ 现代场景 (12,345)
│   ├── 📁 职业
│   │   ├── ☐ 剑士 (2,345)
│   │   └── ☐ 法师 (1,678)
│   └── 📁 视角
│       ├── ☐ 俯视 (5,678)
│       └── ☐ 仰视 (3,456)
```

**核心特性**:
- **动态计数（Facet Counts）**:
  - 选择"双人动作"后，"古代场景"计数实时更新
  - 技术实现: PostgreSQL 聚合查询 + 物化视图缓存
- **视觉化标签**: 图标辅助，如"漫画排版"显示缩略图标
- **层级展开**: 一级维度折叠/展开，减少视觉干扰

### 2.3 图片详情页交互

**设计方案**:
- **模态框覆盖**: 不跳转，保持列表页上下文
- **键盘导航**:
  - ←/→ 切换上/下一张
  - ESC 关闭
  - Space 收藏
- **关联推荐**: 基于标签 Jaccard 相似度
  - 公式: `相似度 = |A ∩ B| / |A ∪ B|`
  - 阈值: > 0.8 即推荐
- **标签聚合入口**: 点击任意标签跳转到该标签的聚合页

### 2.4 敏感内容合规设计

**分层策略**:
- **默认模式**: 隐藏 NSFW 内容
- **安全搜索切换**: 登录 + 年龄验证后可开启
- **视觉标记**:
  - 红色边框
  - 角标图标
  - 高斯模糊预览（点击后显示）
- **数据库标识**: `tags` 包含 `["nsfw"]` 或专门的 `is_nsfw` 字段

---

## 三、数据库架构设计

### 3.1 核心表结构

#### 表：`assets`（图片资源表）

| 字段 | 类型 | 索引 | 说明 |
|------|------|------|------|
| `id` | `bigserial` | PK | 主键（自增） |
| `storage_key` | `text` | - | R2 存储路径，如 `images/abc123.webp` |
| `width` | `int` | - | 图片宽度（默认512） |
| `height` | `int` | - | 图片高度（默认512） |
| `tags` | `jsonb` | **GIN** | 标签数组，如 `["sketch", "action", "running"]` |
| `category_id` | `int` | B-tree | 一级分类ID（动作/背景/人物等） |
| `uploader_id` | `uuid` | FK | 关联 `auth.users` |
| `file_hash` | `char(64)` | Unique | SHA-256 哈希，防重复上传 |
| `created_at` | `timestamptz` | B-tree | 创建时间，用于排序 |
| `is_nsfw` | `boolean` | - | 是否敏感内容 |

**关键索引**:
```sql
CREATE INDEX idx_assets_tags ON assets USING GIN (tags);
CREATE INDEX idx_assets_category ON assets (category_id);
CREATE INDEX idx_assets_created ON assets (created_at DESC);
CREATE INDEX idx_assets_hash ON assets (file_hash);
```

#### 表：`asset_stats`（统计表，分离高频更新）

| 字段 | 类型 | 说明 |
|------|------|------|
| `asset_id` | `bigint` | PK, FK → assets.id |
| `views` | `int` | 浏览量 |
| `downloads` | `int` | 下载量 |
| `favorites` | `int` | 收藏量 |

#### 表：`user_favorites`（用户收藏关系）

| 字段 | 类型 | 索引 |
|------|------|------|
| `user_id` | `uuid` | 复合主键 |
| `asset_id` | `bigint` | 复合主键 |
| `created_at` | `timestamptz` | - |

**复合主键**: `PRIMARY KEY (user_id, asset_id)`

#### 表：`tag_counts`（标签计数缓存，触发器维护）

| 字段 | 类型 | 说明 |
|------|------|------|
| `tag` | `text` | PK, 标签名 |
| `count` | `int` | 包含该标签的图片数量 |
| `last_updated` | `timestamptz` | 最后更新时间 |

**触发器逻辑**:
```sql
-- 当 assets 表插入/更新/删除时，自动更新 tag_counts
CREATE TRIGGER update_tag_counts
AFTER INSERT OR UPDATE OR DELETE ON assets
FOR EACH ROW EXECUTE FUNCTION refresh_tag_counts();
```

### 3.2 高性能查询示例

#### 查询1：多标签筛选

```sql
-- 查找包含 "sketch" 和 "action" 的图片，分页返回
SELECT id, storage_key, tags, created_at
FROM assets
WHERE tags @> '["sketch", "action"]'::jsonb
  AND is_nsfw = false
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;
```

**性能**: GIN 索引下，100万行数据查询 < 10ms

#### 查询2：分面计数（优化版）

```sql
-- 获取当前筛选条件下，各分类的数量
SELECT category_id, COUNT(*) as count
FROM assets
WHERE tags @> '["sketch"]'::jsonb
GROUP BY category_id;
```

**优化策略**: 使用物化视图（Materialized View）缓存常用组合

### 3.3 行级安全策略（RLS）

```sql
-- 启用 RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- 策略1: 所有人可查看非 NSFW 内容
CREATE POLICY "Public read access"
ON assets FOR SELECT
TO public
USING (is_nsfw = false);

-- 策略2: 登录用户可查看 NSFW（需验证年龄）
CREATE POLICY "Authenticated read NSFW"
ON assets FOR SELECT
TO authenticated
USING (
  is_nsfw = true
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND age_verified = true
  )
);

-- 策略3: 仅上传者可修改自己的资源
CREATE POLICY "Owner update"
ON assets FOR UPDATE
TO authenticated
USING (uploader_id = auth.uid());
```

---

## 四、前端项目结构

```
newimg/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   ├── search/                   # 搜索页（主功能）
│   │   ├── page.tsx              # RSC 服务端渲染
│   │   └── components/
│   │       ├── ImageGallery.tsx  # 虚拟化瀑布流
│   │       ├── FilterSidebar.tsx # 分面筛选器
│   │       └── ImageCard.tsx     # 图片卡片
│   ├── asset/[id]/               # 详情页
│   │   └── page.tsx              # ISR 增量静态生成
│   ├── api/                      # API Routes
│   │   ├── upload/route.ts       # 图片上传接口
│   │   └── stats/route.ts        # 统计更新
│   └── globals.css               # Tailwind 全局样式
├── components/                   # 公共组件
│   ├── ui/                       # Shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── modal.tsx
│   │   ├── drawer.tsx
│   │   └── ...
│   ├── ImageModal.tsx            # 图片详情模态框
│   └── BlurHashPlaceholder.tsx   # 占位符组件
├── lib/                          # 工具函数和配置
│   ├── supabase/
│   │   ├── client.ts             # 客户端实例
│   │   ├── server.ts             # 服务端实例
│   │   └── types.ts              # 数据库类型定义
│   ├── r2/
│   │   ├── client.ts             # R2 S3 客户端
│   │   └── upload.ts             # 上传工具
│   ├── utils.ts                  # 通用工具
│   └── constants.ts              # 常量定义
├── hooks/                        # 自定义 Hooks
│   ├── useImageQuery.ts          # 图片查询 Hook
│   ├── useInfiniteScroll.ts      # 无限滚动
│   └── useFacetCounts.ts         # 分面计数
├── types/                        # TypeScript 类型
│   ├── asset.ts
│   ├── tag.ts
│   └── search.ts
├── scripts/                      # 数据迁移脚本
│   ├── migrate.ts                # 图片导入脚本
│   └── clean-tags.ts             # AI 标签清洗
├── public/
│   └── icons/                    # 图标资源
├── .env.local                    # 环境变量
├── next.config.js                # Next.js 配置
├── tailwind.config.ts            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json
```

---

## 五、性能优化策略

### 5.1 前端性能优化

**核心指标目标**:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTI (Time to Interactive)**: < 3.5s

**优化手段**:

1. **React Server Components (RSC)**
   - 数据获取在服务端完成
   - 减少客户端 JS 40-50%

2. **代码分割**
   - 路由级自动分割
   - 组件级动态导入: `const ImageModal = dynamic(() => import('./ImageModal'))`

3. **虚拟滚动**
   - DOM 节点数量恒定（20-30个）
   - 内存占用降低 70-80%

4. **图片优化**
   - WebP 格式（体积减少 60-70%）
   - 懒加载 + BlurHash 占位
   - CDN 边缘缓存

5. **预加载关键资源**
   ```tsx
   <link rel="preload" href="/fonts/inter.woff2" as="font" />
   ```

### 5.2 数据库性能优化

1. **索引优化**
   - GIN 索引（标签）
   - B-tree 索引（时间、分类）
   - 唯一索引（哈希去重）

2. **查询优化**
   - 避免 `SELECT *`
   - 使用 `LIMIT` 分页
   - 物化视图缓存聚合结果

3. **连接池管理**
   - Supabase 自动管理
   - 设置合理的超时时间

4. **分表策略（未来扩展）**
   - 当数据量超过 1000万时，按年份分表

### 5.3 CDN 与缓存策略

**Cloudflare R2 缓存配置**:
```
Cache-Control: public, max-age=31536000, immutable
```

**分层缓存**:
1. **浏览器缓存**: 1年（图片不可变）
2. **CDN 边缘缓存**: Cloudflare 全球节点
3. **数据库查询缓存**: React Query（客户端）

---

## 六、开发规范与工具链

### 6.1 代码规范

**TypeScript 严格模式**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**ESLint + Prettier**:
- 使用 Next.js 推荐配置
- 集成 Tailwind CSS 类名排序插件

**Git 提交规范**:
```
feat: 新功能
fix: 修复bug
perf: 性能优化
refactor: 重构
docs: 文档更新
chore: 构建/工具链
```

### 6.2 AI 辅助开发工具

**推荐工具**:
1. **Cursor**: Schema 设计、复杂逻辑生成
2. **v0.dev**: UI 组件快速原型
3. **GitHub Copilot**: 代码自动补全
4. **ChatGPT**: 架构设计咨询

**示例 Prompt**:
```
Cursor: "生成 Next.js Server Action，处理图片上传至 R2，
返回预签名 URL，验证用户登录，使用 Supabase 存储元数据"
```

### 6.3 测试策略

**测试金字塔**:
- **E2E 测试**: Playwright（关键流程）
- **集成测试**: Vitest + Testing Library（组件）
- **单元测试**: Vitest（工具函数）

**覆盖率目标**: > 70%（核心功能 > 90%）

---

## 七、部署与成本

### 7.1 部署架构

```
用户请求
   ↓
Cloudflare CDN (全球边缘节点)
   ↓
Vercel Edge Network (Next.js 前端)
   ↓
Supabase (PostgreSQL 数据库 + Auth)
   ↓
Cloudflare R2 (图片存储)
```

**特点**: 完全 Serverless，零服务器运维

### 7.2 成本估算（月度，2025年）

| 项目 | 服务 | 费用 | 说明 |
|------|------|------|------|
| 前端托管 | Vercel Pro | $20 | 包含 Serverless 函数调用 |
| 数据库 | Supabase Pro | $25 | 支持 100万行数据 |
| 数据库计算 | Supabase Compute | $10 | 微型实例 |
| 图片存储 | Cloudflare R2 | $1.50 | 100GB × $0.015/GB |
| AI API | OpenRouter | < $5 | 一次性标签清洗 |
| 域名 | Namecheap | $1 | 年费摊销 |
| **总计** | | **~$62.50** | 约 ¥450/月 |

**成本优势**:
- 相比传统架构（EC2 + RDS + S3）节省 **80%+**
- 零运维成本（DevOps）

### 7.3 扩展性规划

**数据量扩展**:
- 100万 → 1000万: 无需架构调整，仅调整数据库配置
- 1000万+: 考虑分表、读写分离

**流量扩展**:
- Vercel 和 Cloudflare 自动扩展
- Supabase Pro 支持更大并发连接池

---

## 八、安全与合规

### 8.1 前端安全

- **XSS 防护**: React 自动转义，禁用 `dangerouslySetInnerHTML`
- **CSP (Content Security Policy)**: 限制资源加载源
- **HTTPS 强制**: Vercel 和 Cloudflare 默认启用

### 8.2 API 安全

- **认证**: Supabase JWT Token
- **权限控制**: RLS（行级安全）
- **速率限制**: Vercel Edge Functions 内置

### 8.3 数据合规

- **GDPR**: 用户数据删除权利
- **COPPA**: 年龄验证机制（NSFW 内容）
- **内容审核**: 敏感标签标识系统

---

## 九、实施路线图

### 第一阶段：基础架构（Week 1-2）

- [x] Next.js 项目初始化
- [x] Supabase 数据库 Schema 设计
- [x] Cloudflare R2 存储配置
- [x] Tailwind + Shadcn/ui 集成
- [x] 基础布局和导航

### 第二阶段：核心功能（Week 3-4）

- [x] 图片列表页（RSC + 虚拟滚动）
- [x] 分面筛选器（动态计数）
- [x] 图片详情模态框
- [x] 用户认证集成

### 第三阶段：数据迁移（Week 5）

- [x] 图片上传脚本（并发）
- [x] AI 标签清洗（OpenRouter）
- [x] 批量导入数据库
- [x] 验证数据完整性

### 第四阶段：优化与上线（Week 6）

- [x] 性能优化（缓存、CDN）
- [x] SEO 优化（sitemap、metadata）
- [x] E2E 测试
- [x] 生产环境部署

---

## 十、总结

本技术框架设计方案完全基于 **plan.txt** 的需求，采用 **Next.js + Supabase + Cloudflare R2** 的现代化 Serverless 架构，针对百万级手绘素材库的特定场景进行深度优化。

**核心优势**:
1. ✅ **高性能**: RSC + 虚拟滚动 + GIN 索引，毫秒级响应
2. ✅ **低成本**: 月运营成本 < $65，比传统架构节省 80%+
3. ✅ **零运维**: 完全托管服务，无需服务器维护
4. ✅ **可扩展**: 支持从百万到千万级数据平滑扩展
5. ✅ **优秀 UX**: "所见即所得"的流畅筛选体验

**技术栈一览**:
```
前端: Next.js 15 (App Router) + React Server Components
UI: Tailwind CSS 3 + Shadcn/ui
数据库: Supabase (PostgreSQL) + JSONB + GIN Index
存储: Cloudflare R2 (零出口费用)
状态管理: URL Parameters (Nuqs)
虚拟化: react-window + Masonic
AI: OpenRouter (DeepSeek-V3 / Llama)
部署: Vercel (前端) + Supabase (后端) + Cloudflare (CDN)
```

---

**文档版本**: v2.0（基于 plan.txt 深度定制）
**最后更新**: 2025-12-21
