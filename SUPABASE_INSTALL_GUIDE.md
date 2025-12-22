# Supabase 本地开发环境安装指南

## 📋 安装概述

本指南详细介绍了如何在本地安装和配置 Supabase 开发环境。Supabase 是一个开源的 Firebase 替代品，提供数据库、身份验证、存储和实时功能。

## ✅ 安装状态

- [x] Node.js v24.5.0 已安装
- [x] npm v11.5.1 已安装
- [x] Supabase CLI v2.67.3 已安装
- [x] 本地 Supabase 服务已启动
- [x] 所有服务验证通过

## 🚀 快速开始

### 1. 访问本地服务

安装完成后，您可以通过以下 URL 访问各种服务：

| 服务 | URL | 描述 |
|------|-----|------|
| **Studio 界面** | http://127.0.0.1:54323 | 管理数据库和查看数据的图形界面 |
| **API 网关** | http://127.0.0.1:54321 | 主要的 API 端点 |
| **Mailpit** | http://127.0.0.1:54324 | 本地邮件测试服务 |
| **数据库** | postgresql://postgres:postgres@127.0.0.1:54322/postgres | PostgreSQL 数据库连接 |

### 2. API 端点

- **REST API**: http://127.0.0.1:54321/rest/v1
- **GraphQL**: http://127.0.0.1:54321/graphql/v1
- **Edge Functions**: http://127.0.0.1:54321/functions/v1
- **Storage (S3)**: http://127.0.0.1:54321/storage/v1/s3

### 3. 认证密钥

```
公开密钥: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
私密密钥: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

## 📝 常用命令

### 启动 Supabase 服务
```bash
npx supabase start
```

### 停止 Supabase 服务
```bash
npx supabase stop
```

### 查看服务状态
```bash
npx supabase status
```

### 重置数据库
```bash
npx supabase db reset
```

### 生成数据库类型
```bash
npx supabase gen types typescript --local > types.ts
```

## 🔧 开发工作流

### 1. 创建数据库迁移
```bash
npx supabase migration new create_users_table
```

### 2. 应用迁移
```bash
npx supabase db push
```

### 3. 查看数据库变更
```bash
npx supabase db diff
```

## 📦 项目依赖

您的项目现在包含以下 Supabase 相关依赖：

```json
{
  "devDependencies": {
    "supabase": "^2.67.3"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

## 🌐 连接示例

### JavaScript/TypeScript
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

const supabase = createClient(supabaseUrl, supabaseKey)

// 示例：查询数据
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

### Python
```python
from supabase import create_client, Client

url: str = "http://127.0.0.1:54321"
key: str = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
supabase: Client = create_client(url, key)

# 示例：查询数据
response = supabase.table('your_table').select("*").execute()
```

## 🛠️ 故障排除

### 如果服务无法启动
1. 确保 Docker Desktop 正在运行
2. 检查端口 54321-54324 是否被占用
3. 尝试重置：`npx supabase stop && npx supabase start`

### 如果连接失败
1. 验证服务状态：`npx supabase status`
2. 检查防火墙设置
3. 确认使用正确的 URL 和密钥

## 📚 更多资源

- [Supabase 官方文档](https://supabase.com/docs)
- [本地开发指南](https://supabase.com/docs/guides/local-development)
- [CLI 参考](https://supabase.com/docs/reference/cli)

## 🎯 下一步

1. 打开 Studio 界面 (http://127.0.0.1:54323) 创建您的第一个表
2. 使用生成的密钥连接您的应用程序
3. 开始构建您的应用！

---

**安装完成时间**: 2025-12-22  
**Supabase 版本**: 2.67.3  
**安装状态**: ✅ 成功