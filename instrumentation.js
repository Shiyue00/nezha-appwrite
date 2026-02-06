// Next.js Instrumentation - 在服务器启动时执行
// 这个文件会在 Next.js 服务端启动时自动调用

export async function register() {
    // 仅在服务端运行
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { spawn } = await import('child_process')
        const fs = await import('fs')
        const path = await import('path')

        const domain = process.env.domain
        const secret = process.env.secret

        if (!domain || !secret) {
            console.error('❌ 错误：请设置 domain 和 secret 环境变量')
            return
        }

        // 查找 agent 文件的位置
        const possiblePaths = [
            path.join(process.cwd(), 'agent'),
            path.join(process.cwd(), 'public', 'agent'),
            '/app/agent',
            './agent'
        ]

        let agentPath = null
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                agentPath = p
                break
            }
        }

        if (!agentPath) {
            console.error('❌ 警告：找不到 agent 文件')
            console.log('📁 当前目录:', process.cwd())
            console.log('📁 尝试过的路径:', possiblePaths)
            return
        }

        console.log('✅ 找到 agent:', agentPath)

        // 设置可执行权限
        try {
            fs.chmodSync(agentPath, 0o755)
            console.log('✅ 已设置执行权限')
        } catch (err) {
            console.error('❌ 设置权限失败:', err.message)
        }

        // 启动 agent
        const args = ['-s', `${domain}:5555`, '-p', secret]
        console.log('🚀 启动 nezha-agent:', agentPath, args.join(' '))

        const child = spawn(agentPath, args, {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        })

        child.stdout.on('data', (data) => {
            console.log(`[agent] ${data.toString().trim()}`)
        })

        child.stderr.on('data', (data) => {
            console.error(`[agent-err] ${data.toString().trim()}`)
        })

        child.on('error', (err) => {
            console.error('❌ Agent 启动失败:', err.message)
        })

        child.on('exit', (code) => {
            console.log(`⚠️ Agent 已退出，退出码: ${code}`)
        })

        // 不要 unref，保持进程引用
        console.log('✅ Nezha Agent 已在后台启动')
    }
}
