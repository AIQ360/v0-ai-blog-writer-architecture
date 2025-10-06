import { NextResponse } from "next/server"
import { tavilySearch } from "@/lib/tavily"

export async function POST(request: Request) {
  try {
    const { topic } = await request.json()
    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 })
    }

    const data = await tavilySearch(topic, { maxResults: 8 })

    return NextResponse.json({
      research: {
        query: data.query,
        meta: { searchId: data.searchId, depth: data.depth },
        results: data.results,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Research failed" }, { status: 500 })
  }
}
