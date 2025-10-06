import { NextResponse } from "next/server"
import { getGoogleModel } from "@/lib/ai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { topic, topKeywords = [] } = await req.json()
    const model = getGoogleModel()
    if (!model) {
      return NextResponse.json({ error: "Missing Google API key for strategy generation" }, { status: 500 })
    }

    const { text } = await generateText({
      model,
      prompt: `
You are an SEO content strategist. Build a content plan for the topic "${topic}" using these high-signal keywords:
${topKeywords
  .slice(0, 25)
  .map((k: string) => `- ${k}`)
  .join("\n")}

Return strictly valid JSON with this shape:
{
  "titleOptions": ["...", "...", "..."],
  "outline": { "h1": "...", "sections": [{"type":"h2","content":"..."},{"type":"h2","content":"..."}] },
  "keywordIntent": "one short paragraph",
  "questions": [{"question":"...","answer":"..."},{"question":"...","answer":"..."}]
}
`,
    })

    let payload: any
    try {
      payload = JSON.parse(text)
    } catch {
      payload = {
        titleOptions: [`${topic}: A Complete Guide`, `${topic} Explained`, `How to Master ${topic}`],
        outline: { h1: `${topic}: A Complete Guide`, sections: [{ type: "h2", content: `Introduction to ${topic}` }] },
        keywordIntent: "Informational intent around the topic.",
        questions: [{ question: `What is ${topic}?`, answer: "Overview." }],
      }
    }

    return NextResponse.json({ strategy: payload })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Strategy failed" }, { status: 500 })
  }
}
