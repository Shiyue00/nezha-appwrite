const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 启动后台 agent 进程的函数
function runAgent() {
  const agentPath = path.resolve(__dirname, './agent');

  // 检查 agent 文件是否存在
  if (!fs.existsSync(agentPath)) {
    console.error(`Error: 'agent' executable not found at ${agentPath}`);
    console.error('Please place the agent file in the project root directory.');
    process.exit(1); // 退出脚本
  }

  try {
    // 1. 设置文件权限为 775 (rwxrwxr-x)，与 Python 脚本中的权限相同
    fs.chmodSync(agentPath, '775');
    console.log(`Successfully set execute permissions for ${agentPath}`);

    // 2. 定义启动 agent 的命令和参数
    const nezhaCommand = agentPath;
    const nezhaArgs = [
      '-s', 'tzz.shiyue.eu.org:5555',
      '-p', 'U4taD04GZBWoOzLcwF',
      '--report-delay', '2'
    ];

    // 3. 启动 nezha-agent 并让它在后台运行
    // 'detached: true' 和 'stdio: 'ignore'' 允许父进程退出后子进程继续运行
    const nezhaProcess = spawn(nezhaCommand, nezhaArgs, {
      detached: true,
      stdio: 'ignore'
    });

    // unref() 允许父进程正常退出，而无需等待子进程
    nezhaProcess.unref();
    console.log('✅ Nezha-agent process started in the background.');

  } catch (error) {
    console.error('❌ Failed to set permissions or start agent:', error.message);
    process.exit(1);
  }
}

// 启动 Next.js 服务器的函数
function runNextServer() {
  console.log('Starting Next.js server...');
  // 使用 npx 跨平台地执行 next start 命令
  // 'stdio: inherit' 会将 Next.js 服务器的输出（日志、错误等）直接显示在当前终端
  const nextServer = spawn('npx', ['next', 'start'], {
    stdio: 'inherit'
  });

  nextServer.on('close', (code) => {
    console.log(`Next.js server exited with code ${code}`);
  });
}

// 主执行流程
runAgent();
runNextServer();
