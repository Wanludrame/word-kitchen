# 文字厨房 🍳

你读过的每一段文字都不会浪费，它们会变成你笔下的味道。

**文字厨房**是一个 AI 驱动的创意写作工具，用厨房的隐喻串联整个创作流程：

- **食材** — 存入你喜欢的文字片段
- **菜名** — 给出一个主题或方向
- **菜式** — 选择体裁（诗歌、小说、散文、小红书……）
- **厨师** — 挑一位风格独特的电子作家（电子大刘、电子古龙、电子鲁迅……）
- **调味** — 微调篇幅、口味、火候等参数
- **上菜** — AI 融合食材风格，端出佳作

## 技术栈

- Next.js 15 / React 19
- Tailwind CSS
- Claude API（流式输出）
- Framer Motion

## 本地开发

```bash
npm install
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 ANTHROPIC_API_KEY
npm run dev
```

访问 http://localhost:3000
