"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

type Result = { title: string; url: string; content: string; source?: string; score?: number }
export default function ResearchModule({
  data,
  isLoading,
}: {
  data: { query: string; meta?: any; results: Result[] } | null
  isLoading?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Module</CardTitle>
        <CardDescription>Real SERP results via Tavily</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div className="text-sm text-gray-500">Fetching search results...</div>}
        {!isLoading && !data && <div className="text-sm text-gray-500">No research data yet.</div>}
        {!!data && (
          <>
            <div className="text-sm text-gray-600">Query: {data.query}</div>
            <div className="space-y-3">
              {data.results.map((r, i) => (
                <div key={i} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium">{r.title}</h4>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{r.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {r.source && <Badge variant="secondary">{r.source}</Badge>}
                    {typeof r.score === "number" && <Badge variant="outline">score {r.score.toFixed(2)}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
