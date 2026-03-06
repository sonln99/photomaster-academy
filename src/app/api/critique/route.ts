import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const mimeType = file.type;
  if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mimeType)) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  try {
    const result = await groq.chat.completions.create({
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
              text: `You are a professional photography critic and instructor. Analyze this photo and provide a detailed critique in Vietnamese. Return your response as a JSON object with this exact structure:

{
  "overall_score": <number 1-100>,
  "composition": { "score": <number 1-100>, "feedback": "<string>" },
  "lighting": { "score": <number 1-100>, "feedback": "<string>" },
  "color": { "score": <number 1-100>, "feedback": "<string>" },
  "focus_sharpness": { "score": <number 1-100>, "feedback": "<string>" },
  "creativity": { "score": <number 1-100>, "feedback": "<string>" },
  "summary": "<string: tổng kết ngắn gọn 2-3 câu>",
  "tips": ["<string: gợi ý cải thiện 1>", "<string: gợi ý 2>", "<string: gợi ý 3>"]
}

Be constructive, specific, and educational. Reference photography concepts (rule of thirds, golden ratio, leading lines, color theory, etc.) where applicable. Return ONLY the JSON, no extra text.`,
            },
          ],
        },
      ],
    });

    const text = result.choices[0]?.message?.content || "";
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
