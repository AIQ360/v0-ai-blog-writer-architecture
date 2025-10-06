"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OutputModule({
  data,
  isLoading,
}: {
  data: {
    research: any
    keywords: any
    strategy: any
    content: { finalDraft?: string } | null
  } | null
  isLoading?: boolean
}) {
  const finalContent = data?.content?.finalDraft || ""
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(finalContent)
      alert("Final draft copied")
    } catch {
      alert("Copy failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Output</CardTitle>
        <CardDescription>Final article and export</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div className="text-sm text-gray-500">Finalizing...</div>}
        {!isLoading && !finalContent && <div className="text-sm text-gray-500">No final content yet.</div>}
        {!!finalContent && (
          <>
            <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">{finalContent}</pre>
            <div className="flex gap-2">
              <Button onClick={copy}>Copy Final Draft</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
