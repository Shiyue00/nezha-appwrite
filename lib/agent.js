import 'server-only'; // 明确标记此文件仅限服务器
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export function runAgent() {
  // 定位到项目根目录下的 agent 文件
  const agentPath = path.resolve(process.cwd(), './agent');

  console.log('[AGENT INFO] Attempting to start agent...');

  if (!fs.existsSync(agentPath)) {
    console.error(`[AGENT ERROR] 'agent' executable not found at ${agentPath}`);
    return;
  }

  try {
    fs.chmodSync(agentPath, '775');
    console.log('[AGENT INFO] Successfully set execute permissions for agent.');

    const nezhaArgs = [
      '-s', 'tzz.shiyue.eu.org:5555',
      '-p', 'U4taD04GZBWoOzLcwF',
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
