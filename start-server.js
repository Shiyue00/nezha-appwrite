const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runAgent() {
  const agentPath = path.resolve(__dirname, './agent');

  if (!fs.existsSync(agentPath)) {
    console.error(`[AGENT ERROR] 'agent' executable not found at ${agentPath}`);
    process.exit(1);
  }

  try {
    fs.chmodSync(agentPath, '775');
    console.log('[AGENT INFO] Successfully set execute permissions for agent.');

    const nezhaArgs = [
      '-s', 'tzz.shiyue.eu.org:5555',
      '-p', 'NpIcYj8qbY9q9VlDi6',
      '--report-delay', '2'
    ];

    // 修改这里：不再 detached 和 ignore stdio，以便我们能看到日志
    const nezhaProcess = spawn(agentPath, nezhaArgs);

    console.log('[AGENT INFO] Nezha-agent process started.');

    // 监听 agent 的标准输出
    nezhaProcess.stdout.on('data', (data) => {
      console.log(`[AGENT STDOUT] ${data.toString().trim()}`);
    });

    // 监听 agent 的标准错误输出
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
    process.exit(1);
  }
}

function runNextServer() {
  console.log('[WEB INFO] Starting Next.js server...');
  const nextServer = spawn('npx', ['next', 'start'], { stdio: 'inherit' });
  nextServer.on('close', (code) => {
    console.log(`[WEB INFO] Next.js server exited with code ${code}`);
  });
}

// 依次执行
runAgent();
runNextServer();
