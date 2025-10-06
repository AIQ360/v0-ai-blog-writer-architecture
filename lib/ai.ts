import { google } from "@ai-sdk/google"

export function getGoogleModel(modelName = "gemini-2.0-flash") {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) return null
  return google(modelName, { apiKey })
}
