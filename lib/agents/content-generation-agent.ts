import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Update this to use the correct environment variable
const geminiModel = process.env.GOOGLE_API_KEY
  ? google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_API_KEY })
  : null

// Fallback to OpenAI if Gemini is not configured
import { openai } from "@ai-sdk/openai"
const fallbackModel = openai("gpt-4o")

export async function contentGenerationAgent({ topic, strategy, keywords }) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    // Step 1: Generate initial draft
    const { text: initialDraft } = await generateText({
      model,
      prompt: `Write a comprehensive article about "${topic}" following this outline:
      
      Title: ${strategy.outline.h1}
      
      Outline:
      ${strategy.outline.sections.map((section) => `- ${section.content}`).join("\n")}
      
      Key points to include:
      ${strategy.outline.keyPointsToInclude.join("\n")}
      
      Target audience: ${strategy.outline.targetAudience}
      Target word count: ${strategy.outline.estimatedWordCount}
      
      Keywords to incorporate naturally: ${keywords.slice(0, 10).join(", ")}`,
    })

    // Step 2: Enhance with examples and statistics
    const { text: enhancedDraft } = await generateText({
      model,
      prompt: `Enhance this article by adding relevant examples, statistics, and quotes where appropriate:
      
      ${initialDraft}`,
    })

    // Step 3: Improve readability
    const { text: readableDraft } = await generateText({
      model,
      prompt: `Improve the readability of this article by:
      1. Varying sentence length
      2. Using simpler language where appropriate
      3. Adding subheadings and bullet points
      4. Breaking up long paragraphs
      
      ${enhancedDraft}`,
    })

    // Step 4: SEO optimization
    const { text: seoOptimized } = await generateText({
      model,
      prompt: `Optimize this article for SEO by:
      1. Ensuring keywords are used naturally throughout
      2. Adding a meta description
      3. Improving title and headings
      4. Adding internal and external link suggestions
      
      ${readableDraft}`,
    })

    // Step 5: Final polish
    const { text: finalDraft } = await generateText({
      model,
      prompt: `Perform a final polish on this article:
      1. Check for consistent tone
      2. Ensure there's a strong introduction and conclusion
      3. Add a compelling call to action
      4. Remove any redundancies
      
      ${seoOptimized}`,
    })

    return {
      initialDraft,
      enhancedDraft,
      readableDraft,
      seoOptimized,
      finalDraft,
    }
  } catch (error) {
    console.error("Error in content generation agent:", error)

    // Return a graceful error with fallback content
    return {
      initialDraft: "Unable to generate initial draft.",
      enhancedDraft: "Unable to generate enhanced draft.",
      readableDraft: "Unable to generate readable draft.",
      seoOptimized: "Unable to generate SEO optimized draft.",
      finalDraft: "Unable to generate final draft. Please try again later.",
      error: error.message || "An error occurred during content generation",
    }
  }
}
