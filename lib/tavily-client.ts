// Tavily API client for fetching search results

export interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
  source: string
}

export interface TavilySearchResponse {
  results: TavilySearchResult[]
  query: string
  search_depth: string
  search_id: string
}

export async function searchTavily(query: string, maxResults = 5): Promise<TavilySearchResponse> {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        max_results: maxResults,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Tavily API error: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching from Tavily:", error)
    throw error
  }
}

export async function analyzeSearchResults(results: TavilySearchResult[], topic: string): Promise<string> {
  try {
    // Extract titles and content snippets
    const titles = results.map((result) => result.title)
    const snippets = results.map((result) => result.content)

    // Create a prompt for analysis
    const analysisPrompt = `
      Analyze these top-ranking articles about "${topic}":
      
      Titles:
      ${titles.join("\n")}
      
      Content Snippets:
      ${snippets.join("\n\n")}
      
      Provide a concise analysis covering:
      1. Common themes and topics across these articles
      2. Content structures and formats that appear successful
      3. Key value propositions these articles offer
      4. Potential content gaps or opportunities
      5. Unique angles a new article could take to stand out
      
      Format your response as a structured analysis that could guide content creation.
    `

    // Use a local AI model or service to analyze the results
    // This is a placeholder - in a real implementation, you would use an AI service
    // For now, we'll return a simple analysis
    return `
      ## Analysis of Top-Ranking Content for "${topic}"
      
      ### Common Themes
      - Most articles focus on practical applications and benefits
      - Step-by-step guides and tutorials are prevalent
      - Real-world examples and case studies are frequently used
      
      ### Content Structure
      - Articles typically begin with a problem statement
      - Most include 5-7 main sections with clear headings
      - Conclusion sections often include calls to action
      
      ### Content Gaps
      - Limited coverage of advanced techniques
      - Few articles address potential drawbacks or limitations
      - Comparative analyses between different approaches are rare
      
      ### Opportunity
      Creating content that addresses these gaps while maintaining the successful structure of top-performing articles could help your content stand out.
    `
  } catch (error) {
    console.error("Error analyzing search results:", error)
    return "Error analyzing search results. Please try again."
  }
}

export function extractContentOpportunities(analysis: string): string[] {
  // This is a placeholder - in a real implementation, you would parse the analysis
  // to extract specific opportunities
  return [
    "Create a comprehensive comparison between different approaches",
    "Address potential drawbacks and limitations that other articles ignore",
    "Include advanced techniques for experienced users",
    "Provide more concrete examples and case studies",
    "Create a troubleshooting section for common issues",
  ]
}
