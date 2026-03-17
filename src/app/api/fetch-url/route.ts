import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "请提供有效的网址" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("invalid protocol");
      }
    } catch {
      return Response.json({ error: "网址格式不正确" }, { status: 400 });
    }

    // Fetch the page
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WordKitchen/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return Response.json(
        { error: `无法访问该网页 (${response.status})` },
        { status: 502 }
      );
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/\s+/g, " ").trim()
      : "";

    // Extract main content: try <article>, then <main>, then <body>
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    let contentHtml = articleMatch?.[1] || mainMatch?.[1] || bodyMatch?.[1] || html;

    // Strip non-content tags
    contentHtml = contentHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "");

    // Convert block elements to newlines, then strip remaining tags
    const contentText = contentHtml
      .replace(/<\/?(p|div|br|h[1-6]|li|blockquote)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Truncate to reasonable length
    const truncatedContent =
      contentText.length > 10000
        ? contentText.slice(0, 10000) + "...(内容过长，已截断)"
        : contentText;

    return Response.json({
      title,
      content: truncatedContent,
      source: parsedUrl.hostname,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("Fetch URL error:", message);

    if (message.includes("timeout") || message.includes("abort")) {
      return Response.json(
        { error: "请求超时，该网页响应太慢" },
        { status: 504 }
      );
    }

    return Response.json(
      { error: `抓取失败: ${message}` },
      { status: 500 }
    );
  }
}
