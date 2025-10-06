import { google } from "@ai-sdk/google"

// Configure the Google AI SDK with the API key from environment variables
// Using the correct environment variable name that we have
export const geminiModel = process.env.GOOGLE_API_KEY
  ? google("gemini-2.0-flash", { apiKey: process.env.GOOGLE_API_KEY })
  : null

// Export a function to check if the API key is configured
export function isGeminiConfigured(): boolean {
  return !!process.env.GOOGLE_API_KEY
}
