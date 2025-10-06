import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Update this to use the correct environment variable
const geminiModel = process.env.GOOGLE_API_KEY
  ? google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_API_KEY })
  : null

// Fallback to OpenAI if Gemini is not configured
import { openai } from "@ai-sdk/openai"
const fallbackModel = openai("gpt-4o")

// Progressive refinement approach for blog content generation
export async function generateBlogContent(topic: string, keywords: string[]) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    // Step 1: Generate initial draft
    const { text: initialDraft } = await generateText({
      model,
      prompt: `Write a blog post about "${topic}" incorporating these keywords: ${keywords.join(", ")}.`,
    })

    // Step 2: Enhance with examples and statistics
    const { text: enhancedDraft } = await generateText({
      model,
      prompt: `Enhance this blog post by adding relevant examples, statistics, and quotes where appropriate:
      
      ${initialDraft}`,
    })

    // Step 3: Improve readability
    const { text: readableDraft } = await generateText({
      model,
      prompt: `Improve the readability of this blog post by:
      1. Varying sentence length
      2. Using simpler language where appropriate
      3. Adding subheadings and bullet points
      4. Breaking up long paragraphs
      
      ${enhancedDraft}`,
    })

    // Step 4: SEO optimization
    const { text: seoOptimized } = await generateText({
      model,
      prompt: `Optimize this blog post for SEO by:
      1. Ensuring keywords are used naturally throughout
      2. Adding a meta description
      3. Improving title and headings
      4. Adding internal and external link suggestions
      
      ${readableDraft}`,
    })

    // Step 5: Final polish
    const { text: finalDraft } = await generateText({
      model,
      prompt: `Perform a final polish on this blog post:
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
    console.error("Error generating blog content:", error)
    return {
      initialDraft: "Error generating content",
      enhancedDraft: "Error generating content",
      readableDraft: "Error generating content",
      seoOptimized: "Error generating content",
      finalDraft: "Error generating content",
      error: error.message,
    }
  }
}

// Alternative approach for competitor research without scraping
export async function analyzeCompetitorContent(topic: string) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    const { text: competitorAnalysis } = await generateText({
      model,
      prompt: `As an expert content strategist, analyze what the top 5 blog posts about "${topic}" would likely contain.
      
      For each hypothetical top post:
      1. Suggest a likely title
      2. Outline the probable structure and main points
      3. Identify what makes it successful
      4. Note potential content gaps or missed opportunities
      
      Format your response as a structured analysis that could guide content creation.`,
    })

    return competitorAnalysis
  } catch (error) {
    console.error("Error analyzing competitor content:", error)
    return "Error analyzing competitor content: " + error.message
  }
}

// Get related keywords from "People also search for"
export async function getRelatedKeywords(topic: string) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    const { text: relatedKeywordsJson } = await generateText({
      model,
      prompt: `For the search query "${topic}", generate 8 likely "People also search for" related queries that would appear on Google. Format as a JSON array of strings.`,
      system:
        "You are a helpful assistant that generates likely related search queries for a given topic. Return only valid JSON.",
    })

    try {
      return JSON.parse(relatedKeywordsJson)
    } catch (e) {
      // Fallback in case parsing fails
      return relatedKeywordsJson.split("\n").filter((line) => line.trim().length > 0)
    }
  } catch (error) {
    console.error("Error getting related keywords:", error)
    return ["Error getting related keywords"]
  }
}
