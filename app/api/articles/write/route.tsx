import { NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"

// Prefer Google, fallback to OpenAI. Both via the AI SDK [^1].
function getModel() {
  const googleKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (googleKey) return google("gemini-2.0-flash", { apiKey: googleKey })
  // Fallback keeps the endpoint usable if Google key is absent.
  return openai("gpt-4o-mini")
}

function toOutlineText(outline: unknown): string {
  try {
    if (!outline) return ""
    if (typeof outline === "string") return outline
    const o: any = outline
    const parts: string[] = []
    if (o?.h1) parts.push(`# ${o.h1}`)
    if (Array.isArray(o?.sections)) {
      for (const s of o.sections) {
        if (s?.heading) parts.push(`## ${s.heading}`)
        if (s?.content) parts.push(String(s.content))
      }
    }
    if (Array.isArray(o?.keyPointsToInclude) && o.keyPointsToInclude.length) {
      parts.push("Key points:")
      for (const k of o.keyPointsToInclude) parts.push(`- ${k}`)
    }
    return parts.join("\n")
  } catch {
    return String(outline)
  }
}

function extractMetaBlock(text: string) {
  const start = text.indexOf("<META_JSON>")
  const end = text.indexOf("</META_JSON>")
  let meta: any = null
  let body = text
  if (start !== -1 && end !== -1 && end > start) {
    const json = text.slice(start + 11, end).trim()
    try {
      meta = JSON.parse(json)
    } catch {
      meta = null
    }
    body = (text.slice(0, start) + text.slice(end + 12)).trim()
  }
  return { meta, body }
}

export async function POST(req: Request) {
  try {
    const {
      topic,
      strategy,
      keywords = [],
      targetWords = 1400,
      tone = "expert but accessible",
      productName,
      productDescription,
    } = (await req.json().catch(() => ({}))) as {
      topic?: string
      strategy?: any
      keywords?: string[]
      targetWords?: number
      tone?: string
      productName?: string
      productDescription?: string
    }

    if (!topic) {
      return NextResponse.json({ error: "Missing 'topic'." }, { status: 400 })
    }

    // Prepare the Provided Facts block from user input. This is the ONLY source of product claims.
    const safeName = (productName || "").trim()
    const safeDesc = (productDescription || "").trim()

    const providedFacts =
      safeName || safeDesc
        ? `Provided Facts About the Product (authoritative; only these can be claimed):
- Name: ${safeName || "not specified"}
- Description: ${safeDesc || "not specified"}`
        : "No explicit product facts were provided. Do not invent any product features or claims."

    const outlineText = toOutlineText(strategy?.outline)

    const system = `You are a senior SEO writer. Produce one publication-ready article in clean Markdown.

Hard rules to avoid hallucinations:
- Make NO claims about the product that are not directly supported by the "Provided Facts" block.
- If a detail is not present in the Provided Facts, say "not specified" or omit it.
- Do NOT invent features, integrations, pricing, performance metrics, customer quotes, or certifications.
- Do NOT promise outcomes that are not in the Provided Facts.
- Do NOT explicitly promote or name competitors. Refer generically ("other tools", "alternatives") if needed.
- Keep the product placement natural: if a subsection doesn’t naturally need the product, do not force it in.

When relevant, include ONE dedicated section titled: "How ${safeName || "This Product"} Helps".
- In that section, describe benefits ONLY using the Provided Facts.
- If benefits are not clear from the facts, explain what is "not specified" rather than guessing.

Structure & style:
- Tone: ${tone}.
- Target: about ${targetWords} words.
- Use scannable headings, short paragraphs, and bullet points when helpful.
- Use the outline as guidance if provided; adapt for clarity.
- Use the keywords naturally (no stuffing).

At the very end, append a JSON block wrapped in <META_JSON>...</META_JSON>:
{
  "title": string,
  "metaDescription": string,
  "slug": string,
  "h1": string,
  "h2": string[],
  "primaryKeywords": string[],
  "internalLinkIdeas": string[],
  "externalLinkIdeas": string[]
}`

    const prompt = `Topic: ${topic}

${providedFacts}

Outline (guidance):
${outlineText || "—"}

Keywords (use naturally if relevant):
${Array.isArray(keywords) && keywords.length ? keywords.join(", ") : "—"}

Output:
1) Final article in Markdown (no preamble)
2) <META_JSON> JSON block`

    const { text, usage } = await generateText({
      model: getModel(),
      system,
      prompt,
    }) // AI SDK call; returns text and usage for transparency [^1]

    const { meta, body } = extractMetaBlock(text)

    const finalDraft = body
    // Backward compat: fill legacy fields with the same final draft
    const content = {
      initialDraft: finalDraft,
      enhancedDraft: finalDraft,
      readableDraft: finalDraft,
      seoOptimized: finalDraft,
      finalDraft,
    }

    return NextResponse.json({ content, meta, usage })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Writer failed" }, { status: 500 })
  }
}
