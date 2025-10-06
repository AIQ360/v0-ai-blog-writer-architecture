"use client"

// Prevent static prerendering to avoid "NextRouter was not mounted" during build
export const dynamic = "force-dynamic"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Loader2 } from "lucide-react"
import ResearchModule from "@/components/article-modules/research-module"
import KeywordModule from "@/components/article-modules/keyword-module"
import StrategyModule from "@/components/article-modules/strategy-module"
import WritingModule from "@/components/article-modules/writing-module"
import OutputModule from "@/components/article-modules/output-module"

type ResearchResult = {
  results: Array<{
    title: string
    url: string
    content: string
    source?: string
    score?: number
  }>
  query: string
  search_id?: string
}

type KeywordResult = {
  user: string[]
  extracted: Array<{ text: string; source?: string }>
  related: string[]
  merged: Array<{ text: string; intent?: string }>
}

export default function NewArticlePage() {
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("input")
  const [isGenerating, setIsGenerating] = useState(false)

  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [seedKeywords, setSeedKeywords] = useState("")

  const [data, setData] = useState<{
    research: { results: ResearchResult["results"]; query: string } | null
    keywords: KeywordResult | null
    strategy: any | null
    content: any | null
  }>({
    research: null,
    keywords: null,
    strategy: null,
    content: null,
  })

  async function callJSON<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      let message = `Request failed: ${res.status}`
      try {
        const err = await res.json()
        if (err?.error) message = err.error
      } catch (_e) {}
      throw new Error(message)
    }
    return res.json() as Promise<T>
  }

  async function run() {
    if (!topic) return
    setIsGenerating(true)
    setProgress(5)

    try {
      // Research (Tavily)
      setActiveTab("research")
      const researchResp = await callJSON<{ research: ResearchResult }>("/api/articles/research", {
        topic,
        description,
      })
      setData((p) => ({
        ...p,
        research: { results: researchResp.research.results, query: researchResp.research.query },
      }))
      setProgress(25)

      // Keywords (use Tavily results + user seeds)
      setActiveTab("keywords")
      const userKeywords = seedKeywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const keywordsResp = await callJSON<{ keywords: KeywordResult }>("/api/articles/keywords", {
        topic,
        userKeywords,
        searchResults: researchResp.research.results,
      })
      setData((p) => ({ ...p, keywords: keywordsResp.keywords }))
      setProgress(50)

      // Strategy (AI, uses top keywords)
      setActiveTab("strategy")
      const topKw = (keywordsResp.keywords.merged || []).slice(0, 20).map((k) => k.text)
      const strategyResp = await callJSON<{ strategy: any }>("/api/articles/strategy", {
        topic,
        productDescription: description,
        topKeywords: topKw,
      })
      setData((p) => ({ ...p, strategy: strategyResp.strategy }))
      setProgress(75)

      // Writing (AI, single pass; passes product description so it’s used)
      setActiveTab("writing")
      const writeResp = await callJSON<{ content: any }>("/api/articles/write", {
        topic,
        productDescription: description,
        strategy: strategyResp.strategy,
        // optional: you can also pass the top keywords
        topKeywords: topKw,
      })
      setData((p) => ({ ...p, content: writeResp.content }))
      setProgress(100)

      setActiveTab("output")
    } catch (e: any) {
      // Basic alert to make failures visible in test
      alert(e?.message || "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Article</h1>
        <p className="text-gray-500 text-center max-w-2xl">
          Generate SEO-optimized blog content with our agent-based AI system
        </p>

        <div className="w-full max-w-3xl mt-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Input</span>
            <span>Research</span>
            <span>Keywords</span>
            <span>Strategy</span>
            <span>Writing</span>
            <span>Output</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="research" disabled={!data.research}>
            Research
          </TabsTrigger>
          <TabsTrigger value="keywords" disabled={!data.keywords}>
            Keywords
          </TabsTrigger>
          <TabsTrigger value="strategy" disabled={!data.strategy}>
            Strategy
          </TabsTrigger>
          <TabsTrigger value="writing" disabled={!data.content}>
            Writing
          </TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Input Module</CardTitle>
              <CardDescription>Provide the article brief</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Topic or Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Comprehensive Guide to AI Blog Writers"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product/Service Description</label>
                <Textarea
                  placeholder="Describe features, niche, target audience"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seed Keywords (optional, comma-separated)</label>
                <Input
                  placeholder="e.g., ai content generation, blog writing tools"
                  value={seedKeywords}
                  onChange={(e) => setSeedKeywords(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={run} className="ml-auto" disabled={isGenerating || !topic}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Start Process <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="research">
          <ResearchModule data={data.research} isLoading={isGenerating && !data.research} />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordModule data={data.keywords} isLoading={isGenerating && !!data.research && !data.keywords} />
        </TabsContent>

        <TabsContent value="strategy">
          <StrategyModule data={data.strategy} isLoading={isGenerating && !!data.keywords && !data.strategy} />
        </TabsContent>

        <TabsContent value="writing">
          <WritingModule data={data.content} isLoading={isGenerating && !!data.strategy && !data.content} />
        </TabsContent>

        <TabsContent value="output">
          <OutputModule data={data} isLoading={false} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
