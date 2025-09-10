import 'server-only';
import { runAgent } from './lib/agent.js';  

export async function register() {
  // 这段代码只会在服务器启动时运行一次
  console.log('[INSTRUMENTATION] Server starting up, registering agent...');
  runAgent();
}
