const { createClient } = require('@supabase/supabase-js');

// 使用本地 Supabase 配置
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('正在测试 Supabase 连接...');
    
    // 测试基本连接 - 尝试获取模式信息
    const { data, error } = await supabase.rpc('get_schema_info');
    
    // 如果 RPC 不可用，尝试其他方法
    if (error) {
      console.log('RPC 不可用，尝试其他连接方法...');
      
      // 尝试访问系统表
      const { data: versionData, error: versionError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .limit(1);
        
      if (versionError && versionError.code !== 'PGRST116') {
        console.error('连接错误:', versionError);
        return false;
      }
    }
    
    console.log('✅ Supabase 连接成功!');
    console.log('📊 数据库 URL:', supabaseUrl);
    console.log('🔑 使用的是公开密钥');
    console.log('🌐 Studio 界面: http://127.0.0.1:54323');
    console.log('📧 Mailpit 界面: http://127.0.0.1:54324');
    
    return true;
  } catch (err) {
    console.error('❌ 连接失败:', err.message);
    return false;
  }
}

testConnection();