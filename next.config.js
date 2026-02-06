/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用 standalone 输出模式，适合容器部署
  output: 'standalone',

  // 启用 instrumentation hook（关键！）
  experimental: {
    instrumentationHook: true,
  },
}

module.exports = nextConfig
