# Nezha Agent for Appwrite Sites

在 Appwrite Sites 上运行哪吒探针的 Next.js 包装器。

## 项目结构

```
├── agent              # 哪吒探针二进制文件 (Linux amd64)
├── app/
│   ├── layout.js      # 页面布局
│   └── page.js        # 首页组件
├── instrumentation.js # 🔑 关键文件：服务启动时运行 agent
├── next.config.js     # Next.js 配置
└── package.json       # 项目依赖
```

## 在 Appwrite Sites 部署

### 1. 推送代码到 GitHub

确保你的仓库包含以上所有文件，包括 `agent` 二进制文件。

### 2. 创建 Appwrite Site

1. 登录 [Appwrite Console](https://cloud.appwrite.io/)
2. 进入项目 → **Sites** → **Create site**
3. 连接 GitHub 仓库

### 3. 配置 Build Settings

| 设置项 | 值 |
|--------|-----|
| **Framework** | Next.js |
| **Install command** | `npm install && chmod +x agent` |
| **Build command** | `npm run build` |
| **Output directory** | `.next` |
| **Server side rendering** | ✅ 启用 |

### 4. 设置环境变量

点击 **Environment variables** → **Create variables**：

| Key | Value |
|-----|-------|
| `domain` | 你的哪吒面板域名 (例: `nezha.example.com`) |
| `secret` | 客户端密钥 |

### 5. 部署

点击 **Create** 开始部署，等待构建完成。

## 工作原理

Next.js 的 `instrumentation.js` 会在服务器启动时自动执行，利用这个特性在后台启动 nezha-agent。

## 注意事项

- `agent` 文件必须是 **Linux amd64** 版本
- 确保 **SSR 模式** 已启用，否则不会执行服务端代码
- 如果 agent 没有启动，检查 Appwrite 的部署日志
