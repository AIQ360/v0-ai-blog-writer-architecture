type TavilyResult = {
  title: string
  url: string
  content: string
  score?: number
}

type TavilyResponse = {
  results: TavilyResult[]
  query: string
  search_depth?: string
  search_id?: string
}

export async function tavilySearch(query: string, opts?: { maxResults?: number }) {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    throw new Error("Missing TAVILY_API_KEY")
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: Math.min(Math.max(opts?.maxResults ?? 8, 1), 12),
      include_answer: false,
      include_images: false,
      include_raw_content: false,
    }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Tavily error ${res.status}: ${txt}`)
  }

  const data = (await res.json()) as TavilyResponse
  const results = (data.results || []).map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    source: new URL(r.url).hostname.replace(/^www\./, ""),
    score: r.score ?? undefined,
  }))

  return {
    query: data.query,
    searchId: (data as any).search_id ?? undefined,
    depth: (data as any).search_depth ?? "advanced",
    results,
  }
}
