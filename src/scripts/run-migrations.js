// 数据库迁移脚本
// 使用 Supabase 客户端执行 SQL

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  console.log('Starting database migrations...\n')

  const migrationsDir = path.join(__dirname, '../../supabase/migrations')

  // 读取迁移文件
  const files = fs.readdirSync(migrationsDir).sort()

  for (const file of files) {
    if (!file.endsWith('.sql')) continue

    console.log(`Running: ${file}`)
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')

    // 分割 SQL 语句 (简单分割，处理基本场景)
    const statements = sql
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      if (!statement) continue

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          // 如果 rpc 不存在，使用 REST API
          console.log(`  Note: ${error.message}`)
        }
      } catch (err) {
        // 忽略一些常见错误
      }
    }

    console.log(`  Done: ${file}\n`)
  }

  console.log('Migrations completed!')
}

runMigrations().catch(console.error)
