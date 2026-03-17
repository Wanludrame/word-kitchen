import { AzureOpenAI } from "openai";
import { NextRequest } from "next/server";

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: "2024-12-01-preview",
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
});

// Maps for building the prompt in Chinese
const PORTION_MAP: Record<string, string> = {
  tiny: "约100字",
  small: "约500字",
  medium: "约1500字",
  large: "约3000字",
  xl: "5000字以上",
};

const FLAVOR_MAP: Record<string, string> = {
  sweet: "温暖治愈",
  salty: "现实犀利",
  spicy: "刺激冲突",
  sour: "讽刺反转",
  bitter: "沉重深刻",
};

const HEAT_MAP: Record<string, string> = {
  bold: "大胆实验，突破常规",
  balanced: "平衡稳当",
  gentle: "保守稳健，循规蹈矩",
};

const PERSPECTIVE_MAP: Record<string, string> = {
  first: "第一人称",
  third: "第三人称",
  omniscient: "全知视角",
  second: "第二人称",
};

const ERA_MAP: Record<string, string> = {
  ancient: "古代背景",
  modern: "近代背景",
  contemporary: "当代背景",
  future: "未来背景",
  any: "时代不限",
};

const DISH_TYPE_MAP: Record<string, string> = {
  poetry: "诗歌",
  novel: "小说",
  xiaohongshu: "小红书风格文案",
  blog: "博客长文",
  podcast: "播客口播稿",
  essay: "散文",
  review: "评论文章",
  "flash-fiction": "500字以内的闪小说",
  lyrics: "歌词",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dishName, dishType, chefStylePrompt, seasoning, ingredients } = body;

    // Build the system prompt
    const systemParts: string[] = [
      "你是「文字厨房」的创作AI。你的任务是根据用户提供的素材风格和主题，创作出高质量的文字作品。",
    ];

    if (chefStylePrompt) {
      systemParts.push(`\n## 写作风格要求\n${chefStylePrompt}`);
    }

    systemParts.push(`\n## 体裁要求\n请创作一篇${DISH_TYPE_MAP[dishType] || dishType}。`);

    // Build seasoning lines — skip 'auto' values
    const seasoningLines: string[] = [];
    if (seasoning.portion && seasoning.portion !== 'auto' && PORTION_MAP[seasoning.portion]) {
      seasoningLines.push(`- 篇幅：${PORTION_MAP[seasoning.portion]}`);
    }
    if (seasoning.heat && seasoning.heat !== 'auto' && HEAT_MAP[seasoning.heat]) {
      seasoningLines.push(`- 创作风格：${HEAT_MAP[seasoning.heat]}`);
    }
    if (seasoning.flavor && seasoning.flavor !== 'auto' && FLAVOR_MAP[seasoning.flavor]) {
      seasoningLines.push(`- 情感基调：${FLAVOR_MAP[seasoning.flavor]}`);
    }
    if (seasoning.perspective && seasoning.perspective !== 'auto' && PERSPECTIVE_MAP[seasoning.perspective]) {
      seasoningLines.push(`- 叙事视角：${PERSPECTIVE_MAP[seasoning.perspective]}`);
    }
    if (seasoning.era && seasoning.era !== 'auto' && seasoning.era !== 'any' && ERA_MAP[seasoning.era]) {
      seasoningLines.push(`- 时代设定：${ERA_MAP[seasoning.era]}`);
    }

    if (seasoningLines.length > 0) {
      systemParts.push(`\n## 调味参数\n${seasoningLines.join('\n')}`);
    } else {
      systemParts.push('\n## 调味参数\n所有参数由你自由决定，选择最适合该主题和体裁的方式。');
    }

    systemParts.push(
      "\n## 输出要求\n- 直接输出作品内容，不要加标题、不要加前缀说明\n- 保持风格统一，文字流畅自然\n- 如果是诗歌或歌词，注意节奏和韵律"
    );

    const system = systemParts.join("\n");

    // Build the user message
    const userParts: string[] = [];

    if (ingredients && ingredients.length > 0) {
      userParts.push("## 参考素材（请从中汲取风格灵感，但不要直接复制）\n");
      for (const ing of ingredients) {
        userParts.push(`### ${ing.title}\n${ing.content}\n`);
      }
    }

    userParts.push(`请以「${dishName}」为主题进行创作。`);

    const userMessage = userParts.join("\n");

    // Use streaming with Azure OpenAI
    const stream = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "",
      max_tokens: 8192,
      stream: true,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
    });

    // Return a streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "生成过程中出错了" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return Response.json({ error: "请求处理失败" }, { status: 500 });
  }
}
