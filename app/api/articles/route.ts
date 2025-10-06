import { NextResponse } from "next/server"
import { orchestrateArticleGeneration } from "@/lib/agents/orchestrator"
import { isGeminiConfigured } from "@/lib/ai-config"
import { createArticle } from "@/lib/articles"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Gemini API key is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 400 })
    }

    const body = await request.json()
    const { topic, description, keywords } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Start the article generation process
    const result = await orchestrateArticleGeneration({
      topic,
      description,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    })

    // Save the article to the database
    const article = await createArticle(
      result.strategy.outline.h1, // Use the generated title
      session.user.id,
      {
        outline: result.strategy.outline,
        content: result.content.finalDraft,
        keyword_intent: result.strategy.keywordIntent,
        narrative: result.strategy.narrative,
        questions: result.strategy.questions,
        versions: {
          initialDraft: result.content.initialDraft,
          enhancedDraft: result.content.enhancedDraft,
          readableDraft: result.content.readableDraft,
          seoOptimized: result.content.seoOptimized,
          finalDraft: result.content.finalDraft,
        },
      },
      result.keywords.keywords.map((keyword) => ({
        keyword,
        intent: "informational", // Default intent
      })),
    )

    return NextResponse.json({
      success: true,
      articleId: article.id,
      result,
    })
  } catch (error) {
    console.error("Error generating article:", error)
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get articles from the database
    const { getArticles } = await import("@/lib/articles")
    const articles = await getArticles()

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
