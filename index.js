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
    return; // 如果找不到 agent，则不继续执行
  }

  try {
    // 赋予 agent 文件执行权限
    fs.chmodSync(agentPath, '775');
    console.log('[AGENT INFO] Successfully set execute permissions for agent.');

    const nezhaArgs = [
      '-s', 'tzz.shiyue.eu.org:5555',
      '-p', 'NpIcYj8qbY9q9VlDi6',
      '--report-delay', '2'
    ];

    // 启动 agent 进程
    const nezhaProcess = spawn(agentPath, nezhaArgs);

    // 监听 agent 的标准输出并打印
    nezhaProcess.stdout.on('data', (data) => {
      console.log(`[AGENT STDOUT] ${data.toString().trim()}`);
    });

    // 监听 agent 的错误输出并打印
    nezhaProcess.stderr.on('data', (data) => {
      console.error(`[AGENT STDERR] ${data.toString().trim()}`);  
    });

    // 监听 agent 进程的退出事件
    nezhaProcess.on('close', (code) => {
      console.log(`[AGENT INFO] Agent process exited with code ${code}`);
    });
    
    // 监听可能发生的启动错误
    nezhaProcess.on('error', (err) => {
      console.error('[AGENT ERROR] Failed to start agent process:', err);
    });

  } catch (error) {
    console.error('[AGENT ERROR] Failed to set permissions or spawn agent:', error.message);
  }
}

// --- 主程序执行入口 ---
console.log('[MAIN] Starting application...');
runAgent();

// ** 关键：保持主进程存活 **
// 很多云平台如果发现主进程退出了，就会认为应用崩溃了并不断重启。
// 我们使用一个定时器来让这个脚本永远运行下去。
setInterval(() => {
  console.log('[KEEPALIVE] Process is active. Agent should be running in the background.');
}, 300000); // 每 5 分钟打印一次日志，证明“我”还活着
