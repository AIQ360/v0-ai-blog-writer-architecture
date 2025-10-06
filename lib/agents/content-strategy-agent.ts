import { generateText, generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

// Update this to use the correct environment variable
const geminiModel = process.env.GOOGLE_API_KEY
  ? google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_API_KEY })
  : null

// Fallback to OpenAI if Gemini is not configured
import { openai } from "@ai-sdk/openai"
const fallbackModel = openai("gpt-4o")

export async function contentStrategyAgent({ topic, research, keywords }) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    // Generate title options
    const { text: titleOptions } = await generateText({
      model,
      prompt: `Generate 3 compelling, SEO-friendly title options for an article about "${topic}".
      
      The titles should:
      1. Include the primary keyword naturally
      2. Be attention-grabbing and click-worthy
      3. Accurately represent the content
      4. Be under 60 characters if possible
      
      Format as a numbered list.
      
      Keywords to consider: ${keywords.keywords.slice(0, 5).join(", ")}`,
    })

    // Generate article outline
    const { object: outline } = await generateObject({
      model,
      schema: z.object({
        h1: z.string(),
        sections: z.array(
          z.object({
            type: z.string(),
            content: z.string(),
            subsections: z.array(z.string()).optional(),
          }),
        ),
        estimatedWordCount: z.number(),
        targetAudience: z.string(),
        keyPointsToInclude: z.array(z.string()),
      }),
      prompt: `Create a detailed outline for an article about "${topic}".
      
      Use the following insights:
      - Research: ${research.topicInsights.substring(0, 500)}...
      - Keywords: ${keywords.keywords.slice(0, 10).join(", ")}
      
      The outline should include:
      1. An H1 title (choose the best option)
      2. Logical sections with H2 headings
      3. Key points to include in each section
      4. Estimated word count
      5. Target audience description
      
      Make the outline comprehensive but focused on providing real value to readers.`,
    })

    // Generate keyword search intent
    const { text: keywordIntent } = await generateText({
      model,
      prompt: `Based on the keywords and topic, describe the likely search intent of readers looking for information about "${topic}".
      
      What are they trying to accomplish? What questions do they have? What problems are they trying to solve?
      
      Keywords: ${keywords.keywords.slice(0, 10).join(", ")}`,
    })

    // Generate article narrative
    const { text: narrative } = await generateText({
      model,
      prompt: `Create a narrative flow for an article about "${topic}".
      
      The narrative should outline the logical progression of ideas, starting from basic concepts and building to more complex insights.
      
      Format as bullet points with main sections and key elements to cover in each.`,
    })

    // Generate questions to cover
    const { object: questions } = await generateObject({
      model,
      schema: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      ),
      prompt: `Generate 5 important questions that readers might have about "${topic}" along with brief answers.
      
      These questions should:
      1. Address common pain points
      2. Cover fundamental concepts
      3. Address advanced considerations
      4. Include practical application questions
      
      Format as question-answer pairs.`,
    })

    return {
      titleOptions,
      outline,
      keywordIntent,
      narrative,
      questions,
    }
  } catch (error) {
    console.error("Error in content strategy agent:", error)

    // Return a graceful error with fallback content
    return {
      titleOptions: "Unable to generate title options.",
      outline: {
        h1: topic,
        sections: [{ type: "h2", content: "Introduction" }],
        estimatedWordCount: 1000,
        targetAudience: "General audience",
        keyPointsToInclude: ["Key information about " + topic],
      },
      keywordIntent: "Unable to generate keyword intent.",
      narrative: "Unable to generate narrative.",
      questions: [{ question: "What is " + topic + "?", answer: "Unable to generate answer." }],
      error: error.message || "An error occurred during content strategy generation",
    }
  }
}
