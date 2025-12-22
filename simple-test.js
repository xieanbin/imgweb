const http = require('http');

function testService(url, serviceName) {
  return new Promise((resolve) => {
    const request = http.request(url, (response) => {
      console.log(`✅ ${serviceName} 服务响应正常 (状态码: ${response.statusCode})`);
      resolve(true);
    });
    
    request.on('error', (err) => {
      console.log(`❌ ${serviceName} 服务连接失败: ${err.message}`);
      resolve(false);
    });
    
    request.setTimeout(3000, () => {
      console.log(`⏰ ${serviceName} 服务响应超时`);
      request.abort();
      resolve(false);
    });
    
    request.end();
  });
}

async function runTests() {
  console.log('🔍 正在验证 Supabase 本地服务...\n');
  
  const services = [
    { url: 'http://127.0.0.1:54321', name: 'API 网关' },
    { url: 'http://127.0.0.1:54323', name: 'Studio 界面' },
    { url: 'http://127.0.0.1:54324', name: 'Mailpit 邮件服务' }
  ];
  
  let allPassed = true;
  
  for (const service of services) {
    const result = await testService(service.url, service.name);
    if (!result) allPassed = false;
  }
  
  console.log('\n📋 服务摘要:');
  console.log('🌐 API URL: http://127.0.0.1:54321');
  console.log('🎨 Studio: http://127.0.0.1:54323');
  console.log('📧 Mailpit: http://127.0.0.1:54324');
  console.log('🗄️  数据库: postgresql://postgres:postgres@127.0.0.1:54322/postgres');
  
  if (allPassed) {
    console.log('\n🎉 Supabase 本地开发环境安装成功！');
  } else {
    console.log('\n⚠️  部分服务可能需要更多时间启动，请稍后再试');
  }
}

runTests();