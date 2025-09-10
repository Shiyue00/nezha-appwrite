const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 启动 Agent 进程的函数
 */
function runAgent() {
  const agentPath = path.resolve(__dirname, './agent');

  console.log('[AGENT INFO] Attempting to start agent...');

  if (!fs.existsSync(agentPath)) {
    console.error(`[AGENT ERROR] 'agent' executable not found at ${agentPath}`);
    return;
  }

  try {
    fs.chmodSync(agentPath, '775'); // 赋予 agent 文件执行权限
    console.log('[AGENT INFO] Successfully set execute permissions for agent.');

    const nezhaArgs = [
      '-s', 'tzz.shiyue.eu.org:5555',
      '-p', 'NpIcYj8qbY9q9VlDi6',
      '--report-delay', '2'
    ];

    const nezhaProcess = spawn(agentPath, nezhaArgs);

    nezhaProcess.stdout.on('data', (data) => console.log(`[AGENT STDOUT] ${data.toString().trim()}`));
    nezhaProcess.stderr.on('data', (data) => console.error(`[AGENT STDERR] ${data.toString().trim()}`));
    nezhaProcess.on('close', (code) => console.log(`[AGENT INFO] Agent process exited with code ${code}`));
    nezhaProcess.on('error', (err) => console.error('[AGENT ERROR] Failed to start agent process:', err));

  } catch (error) {
    console.error('[AGENT ERROR] Failed to set permissions or spawn agent:', error.message);
  }
}

/**
 * 创建并启动 HTTP 服务器
 */
function startServer() {
  // 云平台通过 PORT 环境变量告诉我们应该监听哪个端口
  const PORT = process.env.PORT || 8080;

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Node.js server is running. Agent process has been started in the background.\n');
  });

  server.listen(PORT, () => {
    console.log(`[HTTP SERVER] Server is listening on port ${PORT}`);
  });
}

// --- 主程序执行入口 ---
console.log('[MAIN] Starting application...');
runAgent();      // 启动 Agent
startServer();   // 启动 HTTP 服务器
