"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type LegacyDrafts = {
  initialDraft?: string
  enhancedDraft?: string
  readableDraft?: string
  seoOptimized?: string
  finalDraft?: string
}

type Meta = {
  title?: string
  metaDescription?: string
  slug?: string
  h1?: string
  h2?: string[]
  primaryKeywords?: string[]
  internalLinkIdeas?: string[]
  externalLinkIdeas?: string[]
}

type Usage = {
  // AI SDK returns a "usage" object; keys can vary by provider. We render defensively.
  totalTokens?: number
  inputTokens?: number
  outputTokens?: number
  // Accept any extra fields
  [k: string]: any
}

export default function WritingModule({
  data,
  meta,
  usage,
  isLoading,
  onRegenerate,
}: {
  // data can be the single final draft or legacy drafts (we normalize to final)
  data: string | LegacyDrafts | null
  meta?: Meta | null
  usage?: Usage | null
  isLoading?: boolean
  onRegenerate?: () => Promise<void> | void
}) {
  const finalDraft = useMemo(() => {
    if (!data) return ""
    if (typeof data === "string") return data
    return data.finalDraft || data.seoOptimized || data.readableDraft || data.enhancedDraft || data.initialDraft || ""
  }, [data])

  const tokens = useMemo(() => {
    const total =
      (usage?.totalTokens as number | undefined) ??
      ((usage?.inputTokens || 0) + (usage?.outputTokens || 0) || undefined)
    return {
      total,
      input: usage?.inputTokens as number | undefined,
      output: usage?.outputTokens as number | undefined,
    }
  }, [usage])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <CardTitle>Final Article</CardTitle>
        <CardDescription>
          Single-pass generation to minimize cost. No multi-stage rewrites. Token usage is shown below.
        </CardDescription>
        {onRegenerate ? (
          <div>
            <Button size="sm" variant="outline" onClick={() => onRegenerate()}>
              Regenerate (single call)
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Generating final draft...</div>
        ) : finalDraft ? (
          <>
            {meta ? (
              <div className="rounded-md border p-3 space-y-2">
                <div className="text-sm font-medium">SEO Meta</div>
                {meta.title ? <div className="text-base font-semibold">{meta.title}</div> : null}
                {meta.metaDescription ? <p className="text-sm text-muted-foreground">{meta.metaDescription}</p> : null}
                <div className="flex flex-wrap gap-2">
                  {(meta.primaryKeywords || []).slice(0, 10).map((kw, i) => (
                    <Badge key={kw + i} variant="secondary">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{finalDraft}</div>

            <div className="rounded-md border p-3 text-xs text-muted-foreground space-y-1">
              <div className="font-medium">Token usage (approx)</div>
              <div>Input tokens: {tokens.input ?? "—"}</div>
              <div>Output tokens: {tokens.output ?? "—"}</div>
              <div>Total tokens: {tokens.total ?? "—"}</div>
              <p className="mt-1">
                Tip: One single call replaces the previous 5-call pipeline, significantly cutting token usage and cost.
              </p>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No draft yet.</div>
        )}
      </CardContent>
    </Card>
  )
}
