import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Configure the Google AI model using the correct environment variable
// The SDK expects GOOGLE_GENERATIVE_AI_API_KEY but we have GOOGLE_API_KEY
const geminiModel = process.env.GOOGLE_API_KEY
  ? google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_API_KEY })
  : null

// Fallback to OpenAI if Gemini is not configured
import { openai } from "@ai-sdk/openai"
const fallbackModel = openai("gpt-4o")

export async function researchAgent(topic: string, description?: string) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    // Generate competitor analysis
    const { text: competitorAnalysis } = await generateText({
      model,
      prompt: `As an expert content strategist, analyze what the top 5 blog posts about "${topic}" would likely contain.
      
      For each hypothetical top post:
      1. Suggest a likely title
      2. Outline the probable structure and main points
      3. Identify what makes it successful
      4. Note potential content gaps or missed opportunities
      
      Format your response as a structured analysis that could guide content creation.
      
      Additional context about the topic: ${description || ""}`,
    })

    // Generate topic insights
    const { text: topicInsights } = await generateText({
      model,
      prompt: `Provide key insights about the topic "${topic}" that would be valuable for creating comprehensive content.
      
      Include:
      1. Current trends and developments
      2. Common questions and pain points
      3. Expert perspectives and opinions
      4. Statistical data or research findings (if applicable)
      5. Controversies or debates in this area
      
      Additional context: ${description || ""}`,
    })

    return {
      competitorAnalysis,
      topicInsights,
      error: null,
    }
  } catch (error) {
    console.error("Error in research agent:", error)

    // Return a graceful error with fallback content
    return {
      competitorAnalysis: "Unable to generate competitor analysis. Please try again later.",
      topicInsights: "Unable to generate topic insights. Please try again later.",
      error: error.message || "An error occurred during research",
    }
  }
}
