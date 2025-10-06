import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the API key is configured using our environment variable name
    const isConfigured = !!process.env.GOOGLE_API_KEY

    return NextResponse.json({
      isConfigured,
      message: isConfigured ? "Gemini API key is configured" : "Gemini API key is not configured",
      envVarName: "GOOGLE_API_KEY", // Include the name we're using for clarity
    })
  } catch (error) {
    console.error("Error checking API key:", error)
    return NextResponse.json({ error: "Failed to check API key configuration" }, { status: 500 })
  }
}
