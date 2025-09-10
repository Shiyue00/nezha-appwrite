const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runAgent() {
  const agentPath = path.resolve(__dirname, './agent');
  if (!fs.existsSync(agentPath)) {
    console.error(`Error: 'agent' executable not found at ${agentPath}`);
    process.exit(1);
  }
  try {
    fs.chmodSync(agentPath, '775');
    console.log(`Successfully set execute permissions for ${agentPath}`);
    const nezhaProcess = spawn(agentPath, ['-s', 'tzz.shiyue.eu.org:5555', '-p', 'U4taD04GZBWoOzLcwF', '--report-delay', '2'], { detached: true, stdio: 'ignore' });
    nezhaProcess.unref();
    console.log('✅ Nezha-agent process started in the background.');
  } catch (error) {
    console.error('❌ Failed to set permissions or start agent:', error.message);
    process.exit(1);
  }
}

function runNextServer() {
  console.log('Starting Next.js server...');
  const nextServer = spawn('npx', ['next', 'start'], { stdio: 'inherit' });
  nextServer.on('close', (code) => {
    console.log(`Next.js server exited with code ${code}`);
  });
}

runAgent();
runNextServer();
