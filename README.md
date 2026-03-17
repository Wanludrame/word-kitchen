# 文字厨房 🍳

> **在线体验：https://word-kitchen.vercel.app/**

你读过的每一段文字都不会浪费，它们会变成你笔下的味道。

**文字厨房**是一个 AI 驱动的创意写作工具，用厨房的隐喻串联整个创作流程：

- **报菜名** — 给出一个主题或方向
- **选菜式** — 选择体裁（诗歌、小说、脱口秀稿、小红书……）
- **选手艺** — 名家手艺（电子大刘、电子古龙……）或自创手艺（从素材中提炼风格）
- **调味** — 微调篇幅、口味、火候等参数
- **上菜** — AI 融合风格与灵感，端出佳作

## 技术栈

- Next.js 16 / React 19
- Tailwind CSS
- Azure OpenAI（流式输出）
- Framer Motion

## 本地开发

```bash
npm install
cp .env.local.example .env.local
# 编辑 .env.local，填入 Azure OpenAI 的 API Key、Endpoint、Deployment
npm run dev
```

访问 http://localhost:3000
