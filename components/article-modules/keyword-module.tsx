"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type KeywordsData = {
  userKeywords: string[]
  extractedKeywords: { text: string; score: number }[]
  relatedKeywords: { text: string; score: number }[]
  merged: { text: string; score: number }[]
  groups: Record<string, string[]>
  analysis: string
}

export default function KeywordModule({ data, isLoading }: { data: KeywordsData | null; isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Module</CardTitle>
        <CardDescription>Extracted from SERP titles/snippets + AI enrichment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div className="text-sm text-gray-500">Analyzing keywords...</div>}
        {!isLoading && !data && <div className="text-sm text-gray-500">No keyword data yet.</div>}
        {!!data && (
          <>
            <div>
              <h4 className="font-medium mb-2">Analysis</h4>
              <p className="text-sm text-gray-700">{data.analysis}</p>
            </div>

            {Object.entries(data.groups).map(([group, items]) => (
              <div key={group}>
                <h4 className="font-medium capitalize mb-2">{group} intent</h4>
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 40).map((k, i) => (
                    <Badge key={i} variant="secondary">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
