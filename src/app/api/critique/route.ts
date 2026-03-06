import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 4MB)" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const mimeType = file.type;
  if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mimeType)) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.2-90b-vision-preview",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
              {
                type: "text",
                text: `You are a professional photography critic. Analyze this photo and return ONLY a JSON object (no other text) in Vietnamese:

{
  "overall_score": <1-100>,
  "composition": { "score": <1-100>, "feedback": "<string>" },
  "lighting": { "score": <1-100>, "feedback": "<string>" },
  "color": { "score": <1-100>, "feedback": "<string>" },
  "focus_sharpness": { "score": <1-100>, "feedback": "<string>" },
  "creativity": { "score": <1-100>, "feedback": "<string>" },
  "summary": "<2-3 sentences>",
  "tips": ["<tip1>", "<tip2>", "<tip3>"]
}`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData?.error?.message || res.statusText;
      return NextResponse.json({ error: `Groq API error: ${errMsg}` }, { status: res.status });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    if (!parsed) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Critique]", message);
    return NextResponse.json({ error: `AI analysis failed: ${message}` }, { status: 500 });
  }
}
