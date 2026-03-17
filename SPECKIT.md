# 文字厨房 — 项目计划 (Speckit)

> 把你读过的好文字喂给厨房，点一道菜名，端出一盘你想要的作品。
>
> **线上地址**: https://word-kitchen.vercel.app/
> **代码仓库**: https://github.com/Wanludrame/word-kitchen

---

## 一、核心概念

### 隐喻体系

| 厨房概念 | 实际功能 |
|---------|---------|
| **食材库** | 用户上传/收藏的文字素材（小说片段、文章、笔记、语录等） |
| **菜名** | 创作主题/Prompt（如 "深夜的便利店"、"一封没寄出的信"） |
| **菜式** | 输出体裁 — 凉菜/热菜/甜点/主食/饮品 → 见下表 |
| **手艺** | 写作风格来源，分为名家手艺（预设电子作家）和自创手艺（从素材提炼风格） |
| **调味** | 用户对输出的微调参数（篇幅、情绪、节奏等） |
| **试菜** | 预览 & 迭代，用户可以要求"再炒一遍""少放点盐" |

### 菜式 → 体裁映射

| 菜式 | 体裁 | 说明 |
|------|------|------|
| 🥗 凉菜 | 诗歌 | 短小精致、讲究意象 |
| 🔥 热菜 | 小说 | 有温度的叙事，完整的故事弧 |
| 🍰 甜点 | 小红书文案 | 轻松甜美、传播性强 |
| 🍚 主食 | 博客长文 | 扎实有料、信息密度高 |
| 🍹 饮品 | 播客稿 | 口语化、适合朗读 |
| 🍜 汤品 | 散文/随笔 | 温润流动、情感丰沛 |
| 🧊 冰品 | 影评/书评 | 冷静理性的分析 |
| 🎤 小吃 | 脱口秀稿 | 短小精悍的口语表演稿 |
| 🍶 酒 | 歌词 | 韵律感强、适合吟唱 |

---

## 二、内置电子作家（名家手艺）

每位电子作家是一套预制的风格 stylePrompt，用户选择"名家手艺"后挑一位即可。

### 当前阵容（13位）

| 电子作家 | 风格标签 | 擅长菜式 |
|---------|---------|---------|
| 🚀 电子大刘 | 硬科幻、宏大叙事、冷峻理性、技术浪漫 | 小说、博客 |
| ⚔️ 电子古龙 | 短句如刀、留白极多、浪子侠客、酒与孤独 | 小说、歌词 |
| 🌑 电子陀思妥耶夫斯基 | 灵魂拷问、心理深渊、道德困境、长独白 | 小说、散文 |
| 🔍 电子阿加莎 | 精密推理、优雅毒舌、英式茶点氛围 | 小说、影评 |
| 🌸 电子艾米丽·狄金森 | 破折号呼吸、意象浓缩、死亡与永恒 | 诗歌 |
| 🏔️ 电子余华 | 苦难叙事、黑色幽默、平静写残忍 | 小说、散文 |
| 🌊 电子村上春树 | 都市孤独、爵士乐节奏、猫与意面 | 散文、播客 |
| 💀 电子鲁迅 | 犀利讽刺、杂文利刃、民族反思 | 影评、博客 |
| 🪷 电子李清照 | 婉约细腻、闺阁愁思、人比黄花瘦 | 诗歌、歌词 |
| 🎭 电子王尔德 | 毒舌金句、华丽颓废、反讽结构 | 小红书、影评 |
| 🍺 电子李诞 | 丧系幽默、自嘲哲学、人间不值得 | 脱口秀、播客 |
| 🤓 电子呼兰 | 理工梗、数据吐槽、冷面笑匠 | 脱口秀、博客 |
| 🐦 电子鸟鸟 | 社恐视角、打工人共鸣、软萌毒舌 | 脱口秀、小红书 |

### 扩展计划

- 电子博尔赫斯（迷宫叙事）、电子卡夫卡（荒诞异化）、电子张爱玲（都市苍凉）
- 电子马尔克斯（魔幻现实）、电子太宰治（丧系美学）、电子纳博科夫（语言炫技）
- 用户可通过"自创手艺"上传素材，由 AI 提炼风格后创作

---

## 三、核心功能

### 3.1 食材库（素材管理）

```
用户操作：
├── 上传文字素材（粘贴 / URL 抓取自动提取正文）
├── 为素材打标签（情绪、主题、风格）
├── 素材搜索与筛选
└── [Phase 1+] 素材自动分析、收藏夹分组、向量化检索
```

### 3.2 点菜（创作流程）

```
点菜流程（5步）：
1. 报菜名   → 输入创作主题（可选推荐主题药丸）
2. 选菜式   → 选择输出体裁（9种）
3. 选手艺   → 名家手艺（选电子作家）/ 自创手艺（选素材→AI提炼风格）
4. 调味     → 篇幅、火候、口味、视角、时代等参数
5. 上菜     → 流式生成内容，支持下载 .txt
```

### 3.3 调味系统（参数微调）

| 调味项 | 选项示例 |
|-------|---------|
| 篇幅 | 一小口(100字) / 小份(500字) / 中份(1500字) / 大份(3000字) / 加量(5000+字) |
| 火候 | 生猛(大胆实验) / 适中(平衡) / 文火(保守稳健) |
| 口味 | 甜(温暖治愈) / 咸(现实犀利) / 辣(刺激冲突) / 酸(讽刺反转) / 苦(沉重深刻) |
| 视角 | 第一人称 / 第三人称 / 全知 / 第二人称 |
| 时代 | 古代 / 近代 / 当代 / 未来 / 不限 |

### 3.4 厨房社交（Phase 2+）

- **晒菜**: 分享创作成果到社区
- **菜谱交换**: 分享自建的电子作家模板
- **食材市集**: 公开优质素材集（需授权）
- **拼桌**: 多人协作，各出食材，共写一篇

---

## 四、技术架构

### 当前架构（Phase 0）

```
┌─────────────────────────────────────────────┐
│                  前端 (Web)                   │
│      Next.js 15 + React 19 + TailwindCSS    │
│      Framer Motion + shadcn/ui              │
├─────────────────────────────────────────────┤
│              API Routes                      │
│  /api/cook          → 流式创作（SSE）         │
│  /api/extract-style → 从素材提炼风格          │
│  /api/fetch-url     → 服务端抓取网页正文       │
├─────────────────────────────────────────────┤
│              AI 引擎                         │
│        Azure OpenAI (gpt-5.3-chat)          │
├─────────────────────────────────────────────┤
│              数据层                           │
│           localStorage（客户端）              │
├─────────────────────────────────────────────┤
│              部署                             │
│              Vercel                          │
└─────────────────────────────────────────────┘
```

### Phase 1+ 目标架构

```
┌─────────────────────────────────────────────┐
│                  前端 (Web/App)               │
│         Next.js + TailwindCSS + Framer       │
├─────────────────────────────────────────────┤
│                  API 网关层                    │
│              Next.js API Routes              │
├──────────┬──────────┬───────────────────────┤
│ 素材服务  │ 创作服务  │ 用户服务              │
│ 上传解析  │ Prompt   │ 认证授权              │
│ 标签提取  │ 编排引擎  │ 食材库管理            │
│ 向量化   │ 流式输出  │ 创作历史              │
├──────────┴──────────┴───────────────────────┤
│              AI 引擎层                        │
│  Azure OpenAI（主力） + Embedding Model      │
├─────────────────────────────────────────────┤
│              数据层                           │
│  PostgreSQL + pgvector（向量检索）             │
│  Redis（缓存/会话）                           │
│  S3/R2（素材文件存储）                         │
└─────────────────────────────────────────────┘
```

### 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端 | Next.js 15 + React 19 | SSR + 流式渲染，中文SEO友好 |
| 样式 | TailwindCSS + shadcn/ui | 快速开发，组件丰富 |
| 动效 | Framer Motion | 厨房主题动效（翻炒、上菜等） |
| AI | Azure OpenAI (gpt-5.3-chat) | 中文理解力强，风格模仿出色 |
| 数据库 | PostgreSQL + Prisma（Phase 1+） | 关系数据 + ORM |
| 向量 | text-embedding-3-small + pgvector（Phase 1+） | 素材语义检索 |
| 缓存 | Redis / Upstash（Phase 1+） | 会话状态、限流 |
| 存储 | Cloudflare R2（Phase 1+） | 素材文件，低成本 |
| 部署 | Vercel | Next.js 原生支持 |
| 认证 | NextAuth.js / Clerk（Phase 1+） | 快速接入微信/邮箱登录 |

### Prompt 编排核心逻辑

```
输入:
  - 手艺(名家 stylePrompt 或 素材提炼的 stylePrompt)
  - 菜名(主题)
  - 菜式(体裁)
  - 调味(参数)

编排:
  System Prompt = 基础人格 + 风格要求(stylePrompt) + 体裁约束 + 调味参数
  User Prompt   = "请以'{菜名}'为主题进行创作。"

  自创手艺时多一步：
  1. 先调 /api/extract-style，将素材发给 AI 提炼 stylePrompt
  2. 再用提炼出的 stylePrompt 走正常创作流程

输出:
  流式返回（SSE） → 前端逐字显示
```

---

## 五、数据模型

### 当前（Phase 0 — localStorage）

```typescript
interface Ingredient {     // 食材
  id: string;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: number;
}

interface Creation {       // 作品
  id: string;
  dishName: string;        // 菜名（主题）
  dishType: DishType;      // 菜式（体裁）
  chefId: string;          // 厨师ID 或 "custom"
  craftMode?: 'master' | 'custom';  // 名家/自创
  seasoning: Seasoning;    // 调味参数
  content: string;         // 生成内容
  ingredientIds: string[]; // 引用的食材ID
  createdAt: number;
}
```

### Phase 1+ 目标（PostgreSQL + Prisma）

```prisma
model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  ingredients Ingredient[]
  creations   Creation[]
  cookbooks   Cookbook[]
}

model Ingredient {
  id        String   @id @default(cuid())
  userId    String
  title     String
  content   String   @db.Text
  source    String?
  tags      String[]
  embedding Float[]
  user      User     @relation(fields: [userId], references: [id])
}

model Creation {
  id          String   @id @default(cuid())
  userId      String
  dishName    String
  dishType    String
  chefId      String
  craftMode   String?
  seasoning   Json
  content     String @db.Text
  ingredients String[]
  isPublic    Boolean @default(false)
  createdAt   DateTime @default(now())
  user        User   @relation(fields: [userId], references: [id])
}

model Cookbook {
  id             String   @id @default(cuid())
  userId         String
  name           String
  description    String
  stylePrompt    String   @db.Text
  sampleTexts    String[]
  isPublic       Boolean  @default(false)
  user           User     @relation(fields: [userId], references: [id])
}
```

---

## 六、UI/UX 设计方向

### 视觉风格
- **主色调**: 暖橙 + 深棕 + 米白（厨房质感）
- **风格**: 手绘插画感 + 干净排版，像一本精美的菜谱
- **字体**: 中文用思源宋体/霞鹜文楷，英文用 Playfair Display

### 核心页面

```
/                    → 首页：烹饪四步曲 + 菜单预览 + 大厨阵容
/kitchen             → 厨房：点菜主界面（报菜名→选菜式→选手艺→调味→上菜）
/pantry              → 食材库：管理上传的文字素材（支持URL导入）
/creations           → 出菜记录：创作历史
/menu                → [Phase 1+] 菜单：浏览所有体裁和电子作家
/cookbook/:id         → [Phase 1+] 菜谱详情：电子作家介绍 + 代表作品
/creation/:id        → [Phase 1+] 作品详情：阅读 + 分享
/community           → [Phase 2+] 社区：晒菜 + 菜谱交换
/profile             → [Phase 1+] 个人中心：我的作品、食材、菜谱
```

### 交互亮点
- 点菜过程用**步骤动画**串联，5步进度指示
- 生成中显示"烹饪进度"文案，逐字流式输出
- 名家手艺用下拉选择器，自创手艺用素材多选
- 报菜名提供推荐主题药丸，降低创作门槛

---

## 七、开发路线图

### Phase 0 — 原型验证 (MVP) ✅ 已完成

**目标**: 最小可用产品，验证核心体验
**已实现**:
- [x] 食材库（文本粘贴 + URL抓取导入）
- [x] 5步点菜流程（报菜名→选菜式→选手艺→调味→上菜）
- [x] 名家手艺：13位电子作家，下拉选择
- [x] 自创手艺：选素材→AI提炼风格→创作
- [x] Azure OpenAI 接入 + 流式输出（SSE）
- [x] 完整调味系统（篇幅/火候/口味/视角/时代）
- [x] 9种体裁（含脱口秀稿）
- [x] 本地存储（localStorage）
- [x] 创作历史查看 + .txt 下载
- [x] 首页展示（四步曲 + 菜单 + 大厨阵容）
- [x] Vercel 部署上线

**技术**: Next.js 15 + React 19 + Azure OpenAI + localStorage

### Phase 1 — 厨房开张
**目标**: 完整的单人创作体验
- [ ] 用户系统（注册/登录）
- [ ] 数据库迁移（localStorage → PostgreSQL）
- [ ] 食材库增强（标签搜索/筛选/分组）
- [ ] 向量化素材 + 语义检索
- [ ] 创作历史管理（编辑/删除/收藏）
- [ ] 响应式设计（移动端适配）
- [ ] 试菜功能（"再来一份"/"换个做法"迭代）

### Phase 2 — 开门迎客
**目标**: 社交与分享
- [ ] 作品分享（生成精美卡片）
- [ ] 社区浏览与发现
- [ ] 自建菜谱（自定义电子作家持久化）
- [ ] 菜谱市集
- [ ] 导出功能（Markdown/PDF/图片）

### Phase 3 — 满汉全席
**目标**: 高级功能与商业化
- [ ] 拼桌（多人协作创作）
- [ ] 长篇连载模式（章回体创作）
- [ ] 食材自动分析（人物图谱、风格指纹）
- [ ] API 开放（让其他应用接入文字厨房）
- [ ] 会员体系 & 商业化

---

## 八、命名规范

保持厨房隐喻的一致性：

| 技术概念 | 厨房命名 | 变量名 |
|---------|---------|--------|
| 用户素材 | 食材 | `ingredient` |
| 创作主题 | 菜名 | `dishName` |
| 输出体裁 | 菜式 | `dishType` |
| 写作风格 | 手艺 | `craftMode` + `stylePrompt` |
| 预设风格 | 名家手艺 | `craftMode: 'master'` |
| 素材提炼风格 | 自创手艺 | `craftMode: 'custom'` |
| 电子作家 | 厨师 | `chef` |
| 参数调整 | 调味 | `seasoning` |
| 生成内容 | 作品/菜 | `creation` / `dish` |
| 素材库 | 食材柜/储藏室 | `pantry` |
| 创作界面 | 厨房 | `kitchen` |
| 创作历史 | 出菜记录 | `creations` |
| 迭代修改 | 回锅/翻炒 | `reCook` |

---

## 九、差异化与愿景

### 和普通AI写作工具的区别
1. **食材驱动**: 不是"凭空写"，而是从用户的阅读积累中汲取养分
2. **风格可控**: 名家手艺 + 自创手艺，让风格选择具象化、可组合
3. **体验有趣**: 厨房隐喻让创作过程本身就是一种享受
4. **个人资产**: 食材库是用户的文字基因库，越用越懂你

### 一句话愿景
> **"你读过的每一段文字都不会浪费，它们会变成你笔下的味道。"**
