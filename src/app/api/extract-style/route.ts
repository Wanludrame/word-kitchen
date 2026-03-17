import { AzureOpenAI } from "openai";
import { NextRequest } from "next/server";

let _client: AzureOpenAI | null = null;
function getClient() {
  if (!_client) {
    _client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: "2024-12-01-preview",
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    });
  }
  return _client;
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return Response.json({ error: "请提供至少一份素材" }, { status: 400 });
    }

    const materialText = ingredients
      .map((ing: { title: string; content: string }) => `### ${ing.title}\n${ing.content}`)
      .join("\n\n");

    const response = await getClient().chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            `你是一位写作风格分析专家。请阅读用户提供的文本素材，从中提炼出一段写作风格描述（200字以内）。描述应涵盖：语言特色、句式节奏、情感基调、修辞手法、叙事偏好等维度。这段描述将被用作AI创作的风格指导，所以请用祈使句式书写（如"你的文字……""你擅长……"）。只输出风格描述本身，不要加标题或前缀。`,
        },
        {
          role: "user",
          content: `请从以下素材中提炼写作风格：\n\n${materialText}`,
        },
      ],
    });

    const stylePrompt = response.choices[0]?.message?.content?.trim() || "";

    if (!stylePrompt) {
      return Response.json({ error: "未能提炼出风格描述" }, { status: 500 });
    }

    return Response.json({ stylePrompt });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("Extract style error:", message);
    return Response.json({ error: `风格提炼失败: ${message}` }, { status: 500 });
  }
}
