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

// --- 主程序执行入口 ---
console.log('[MAIN] Starting application to run agent...');
runAgent();

// ** 关键：保持主进程存活 **
// 我们去掉了 HTTP 服务器，但仍然需要这个定时器来防止主进程退出。
setInterval(() => {
  console.log('[KEEPALIVE] Process is active. Agent should be running in the background.');
}, 300000); // 每 5 分钟打印一次日志
