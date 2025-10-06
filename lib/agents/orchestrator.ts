import { researchAgent } from "./research-agent"
import { keywordAgent } from "./keyword-agent"
import { contentStrategyAgent } from "./content-strategy-agent"
import { contentGenerationAgent } from "./content-generation-agent"

// Make sure we're not initializing the Google AI SDK here
export async function orchestrateArticleGeneration(input: {
  topic: string
  description?: string
  keywords?: string[]
}) {
  try {
    // Step 1: Research phase
    console.log("Starting research phase...")
    const researchResults = await researchAgent(input.topic, input.description)
    if (researchResults.error) {
      throw new Error(`Research phase failed: ${researchResults.error}`)
    }

    // Step 2: Keyword analysis
    console.log("Starting keyword analysis...")
    const keywordResults = await keywordAgent(input.topic, input.keywords || [])
    if (keywordResults.error) {
      throw new Error(`Keyword analysis failed: ${keywordResults.error}`)
    }

    // Step 3: Content strategy
    console.log("Starting content strategy...")
    const contentStrategy = await contentStrategyAgent({
      topic: input.topic,
      research: researchResults,
      keywords: keywordResults,
    })
    if (contentStrategy.error) {
      throw new Error(`Content strategy failed: ${contentStrategy.error}`)
    }

    // Step 4: Content generation with progressive refinement
    console.log("Starting content generation...")
    const content = await contentGenerationAgent({
      topic: input.topic,
      strategy: contentStrategy,
      keywords: keywordResults.keywords,
    })
    if (content.error) {
      throw new Error(`Content generation failed: ${content.error}`)
    }

    return {
      topic: input.topic,
      research: researchResults,
      keywords: keywordResults,
      strategy: contentStrategy,
      content,
    }
  } catch (error) {
    console.error("Error in orchestration:", error)
    return {
      topic: input.topic,
      error: error.message || "An error occurred during article generation",
      step: error.step || "unknown",
    }
  }
}
