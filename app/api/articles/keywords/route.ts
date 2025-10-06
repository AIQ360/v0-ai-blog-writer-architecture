import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getGoogleModel } from "@/lib/ai"
import { generateText } from "ai"

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "by",
  "is",
  "are",
  "as",
  "at",
  "be",
  "it",
  "this",
  "that",
  "from",
  "your",
  "you",
  "we",
  "our",
  "their",
  "how",
  "what",
  "why",
  "when",
  "where",
  "who",
  "which",
  "than",
  "then",
  "into",
  "about",
])

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

function extractPhrases(texts: string[], topic: string) {
  const counts = new Map<string, number>()
  const add = (phrase: string) => {
    const k = phrase.trim()
    if (!k) return
    counts.set(k, (counts.get(k) || 0) + 1)
  }

  const seed = [topic, ...texts]
  for (const t of seed) {
    const toks = tokenize(t)
    // unigrams, bigrams, trigrams
    for (let i = 0; i < toks.length; i++) {
      const w1 = toks[i]
      if (!STOP_WORDS.has(w1) && w1.length > 2) add(w1)
      if (i + 1 < toks.length) {
        const w2 = toks[i + 1]
        if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2)) add(`${w1} ${w2}`)
      }
      if (i + 2 < toks.length) {
        const w2 = toks[i + 1]
        const w3 = toks[i + 2]
        if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && !STOP_WORDS.has(w3)) add(`${w1} ${w2} ${w3}`)
      }
    }
  }

  const items = Array.from(counts.entries())
    .map(([text, freq]) => ({ text, score: freq }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)

  return items
}

export async function POST(req: NextRequest) {
  try {
    const { topic, userKeywords = [], searchResults = [] } = await req.json()

    if (!topic || !Array.isArray(searchResults)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const titles = searchResults.map((r: any) => r.title || "")
    const snippets = searchResults.map((r: any) => r.content || "")
    const extracted = extractPhrases([...titles, ...snippets], topic)

    // try to enrich with AI (optional)
    let related: { text: string; score: number }[] = []
    let analysis = `Extracted ${extracted.length} candidate keywords from SERP titles/snippets.`
    const model = getGoogleModel()
    if (model) {
      const { text } = await generateText({
        model,
        prompt: `
Given a topic "${topic}" and the following extracted keyword phrases:

${extracted
  .slice(0, 40)
  .map((k) => `- ${k.text}`)
  .join("\n")}

1) Return 20 additional closely-related keywords or phrases not present above.
2) Provide a 2-3 sentence analysis describing user intent patterns and suggested coverage.

Return JSON with shape:
{
  "related": ["...", "..."],
  "analysis": "..."
}
`,
      })
      try {
        const parsed = JSON.parse(text)
        related = Array.isArray(parsed.related)
          ? parsed.related.slice(0, 20).map((t: string, i: number) => ({ text: String(t), score: 0.5 - i * 0.01 }))
          : []
        if (parsed.analysis) analysis = String(parsed.analysis)
      } catch {
        // ignore parse error, keep heuristic output only
      }
    }

    const uniqueSet = new Set<string>()
    const merged = [...userKeywords.map((t: string) => ({ text: t, score: 1 })), ...extracted, ...related].filter(
      (k) => {
        const key = k.text.toLowerCase()
        if (uniqueSet.has(key)) return false
        uniqueSet.add(key)
        return true
      },
    )

    // simple intent grouping heuristic
    const groups: Record<string, string[]> = { informational: [], commercial: [], navigational: [], transactional: [] }
    for (const k of merged) {
      const t = k.text.toLowerCase()
      if (/(buy|pricing|cost|best|vs|compare|review)/.test(t)) groups.commercial.push(k.text)
      else if (/(login|dashboard|official|site|homepage)/.test(t)) groups.navigational.push(k.text)
      else if (/(download|subscribe|signup|purchase|order)/.test(t)) groups.transactional.push(k.text)
      else groups.informational.push(k.text)
    }

    return NextResponse.json({
      keywords: {
        userKeywords,
        extractedKeywords: extracted,
        relatedKeywords: related,
        merged: merged.slice(0, 120),
        groups,
        analysis,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Keywords failed" }, { status: 500 })
  }
}
