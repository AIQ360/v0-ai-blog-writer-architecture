import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"

// Update this to use the correct environment variable
const geminiModel = process.env.GOOGLE_API_KEY
  ? google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_API_KEY })
  : null

// Fallback to OpenAI if Gemini is not configured
const fallbackModel = openai("gpt-4o")

export async function keywordAgent(topic: string, userKeywords: string[] = [], searchResults: any[] = []) {
  // Choose the model to use
  const model = geminiModel || fallbackModel

  try {
    // Extract keywords from search results
    const extractedKeywords = extractKeywordsFromSearchResults(searchResults)

    // Generate related keywords using AI
    const relatedKeywords = await getRelatedKeywords(topic, extractedKeywords, model)

    // Combine all keywords (user provided, extracted, and related)
    const allKeywords = [...new Set([...userKeywords, ...extractedKeywords, ...relatedKeywords])]

    // Analyze keyword intent and cluster them
    const { text: keywordAnalysis } = await generateText({
      model,
      prompt: `Analyze these keywords related to "${topic}" and:
      
      1. Identify the search intent for each (informational, commercial, etc.)
      2. Group them into logical clusters
      3. Rank them by estimated importance for a comprehensive article
      4. For each keyword, estimate the difficulty to rank (easy, medium, hard)
      
      Keywords: ${allKeywords.join(", ")}
      
      Format your response in a structured way with clear sections for intent categories, clusters, and rankings.`,
    })

    return {
      keywords: allKeywords,
      userKeywords,
      extractedKeywords,
      relatedKeywords,
      analysis: keywordAnalysis,
    }
  } catch (error) {
    console.error("Error in keyword agent:", error)

    // Return a graceful error with fallback content
    return {
      keywords: userKeywords,
      userKeywords,
      extractedKeywords: [],
      relatedKeywords: [],
      analysis: "Unable to generate keyword analysis. Please try again later.",
      error: error.message || "An error occurred during keyword analysis",
    }
  }
}

// Extract keywords from search results
function extractKeywordsFromSearchResults(searchResults) {
  if (!searchResults || searchResults.length === 0) {
    return []
  }

  // Combine all titles and snippets
  const allText = searchResults.map((result) => `${result.title} ${result.content}`).join(" ")

  // Simple keyword extraction based on frequency
  // In a real implementation, you might use a more sophisticated NLP approach
  const words = allText
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3) // Filter out short words
    .filter((word) => !stopWords.includes(word)) // Filter out stop words

  // Count word frequency
  const wordCounts = {}
  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })

  // Get top keywords by frequency
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) // Get top 15 keywords
    .map((entry) => entry[0])
}

async function getRelatedKeywords(topic: string, extractedKeywords: string[], model) {
  try {
    const { text: relatedKeywordsJson } = await generateText({
      model,
      prompt: `For the search query "${topic}" and these extracted keywords: ${extractedKeywords.join(", ")}, 
      generate 10 highly relevant "People also search for" related queries that would appear on Google. 
      Include a mix of:
      - Long-tail variations
      - Question-based queries
      - Comparison queries
      - "How to" and "Best" queries related to the topic
      
      Format as a JSON array of strings.`,
      system:
        "You are a helpful assistant that generates likely related search queries for a given topic. Return only valid JSON.",
    })

    try {
      return JSON.parse(relatedKeywordsJson)
    } catch (e) {
      // Fallback in case parsing fails
      return relatedKeywordsJson
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^[0-9\-.*]+\s*/, "")) // Remove list markers
    }
  } catch (error) {
    console.error("Error generating related keywords:", error)
    return []
  }
}

// Common English stop words to filter out
const stopWords = [
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
]
