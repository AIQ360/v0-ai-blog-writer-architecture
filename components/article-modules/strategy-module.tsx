"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Section = { type: "h2" | "h3"; content: string }
type StrategyData = {
  titleOptions: string[]
  outline: { h1: string; sections: Section[] }
  keywordIntent: string
  questions: { question: string; answer: string }[]
}

export default function StrategyModule({ data, isLoading }: { data: StrategyData | null; isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Strategy</CardTitle>
        <CardDescription>Titles, outline, and FAQ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && <div className="text-sm text-gray-500">Building strategy...</div>}
        {!isLoading && !data && <div className="text-sm text-gray-500">No strategy yet.</div>}
        {!!data && (
          <>
            <div>
              <h4 className="font-medium mb-2">Title options</h4>
              <ul className="list-disc pl-5 text-sm text-gray-800">
                {data.titleOptions.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Outline</h4>
              <div className="text-sm">
                <div className="font-semibold mb-1">H1: {data.outline.h1}</div>
                <ul className="list-disc pl-5 space-y-1">
                  {data.outline.sections.map((s, i) => (
                    <li key={i}>
                      <span className="font-medium">{s.type.toUpperCase()}:</span> {s.content}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Keyword intent</h4>
              <p className="text-sm text-gray-700">{data.keywordIntent}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Questions to cover</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {data.questions.map((q, i) => (
                  <li key={i}>
                    <span className="font-semibold">{q.question}</span> — {q.answer}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
