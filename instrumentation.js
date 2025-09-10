// 这个文件本身也可以标记为 server-only
import 'server-only';

export async function register() {
  // 关键检查：确保这段代码只在 Node.js 服务器环境（而不是 Edge 环境）中运行
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[INSTRUMENTATION] Node.js server starting up, preparing to run agent...');  
    
    // 使用动态导入来避免 Webpack 在构建时打包客户端不需要的模块
    // 这会返回一个 Promise，所以我们使用 await
    const { runAgent } = await import('./lib/agent.js');
    
    // 调用函数来启动 agent
    runAgent();
  }
}
