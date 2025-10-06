"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, RotateCw, Send } from "lucide-react"
import ArticleEditor from "@/components/article-editor"
import ArticleOutline from "@/components/article-outline"
import ContentBrief from "@/components/content-brief"
import ArticleDetails from "@/components/article-details"

export default function ArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, fetch the article data from your API
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        // This would be a real API call in production
        // const response = await fetch(`/api/articles/${id}`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockArticle = {
          id,
          title: "Comprehensive Guide to AI Blog Writing",
          status: "generated",
          contentGrade: "A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          outline: [
            { type: "h1", content: "Comprehensive Guide to AI Blog Writing" },
            { type: "-", content: "Introduction (No title)" },
            { type: "h2", content: "Key Features of AI Blog Writers" },
            { type: "h2", content: "Applications of AI Content Generation" },
            { type: "h2", content: "Challenges and Considerations" },
            { type: "h2", content: "Conclusion and Key Takeaways" },
          ],
          content: "AI blog writers transform content creation by leveraging advanced machine learning...",
          keywordIntent:
            "Readers searching for AI blog writers are looking for tools and insights to efficiently create high-quality content from text prompts...",
          narrative: [
            "- Explanation of AI content generation capabilities",
            "- Creation of blog posts from text descriptions",
            "- Model options and customization",
            "- Core functionalities and enhancements",
            "- User interaction and editing features",
            "- Performance and ethical considerations",
          ],
          questions: [
            { question: "How do AI blog writers work?", answer: "AI blog writers use machine learning..." },
            { question: "What are the benefits of using AI for content?", answer: "The benefits include..." },
          ],
        }

        setArticle(mockArticle)
      } catch (error) {
        console.error("Error fetching article:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading article...</div>
  }

  if (!article) {
    return <div className="flex items-center justify-center h-full">Article not found</div>
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:ml-0 ml-8">
          <h1 className="text-lg font-medium truncate max-w-md">{article.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <RotateCw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b">
              <TabsList className="mx-4 my-1">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="content-brief">Content brief</TabsTrigger>
                <TabsTrigger value="outline">Outline</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="flex-1 overflow-auto p-0 m-0">
              <ArticleEditor article={article} />
            </TabsContent>

            <TabsContent value="content-brief" className="flex-1 overflow-auto p-0 m-0">
              <ContentBrief article={article} />
            </TabsContent>

            <TabsContent value="outline" className="flex-1 overflow-auto p-0 m-0">
              <ArticleOutline article={article} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-80 border-l overflow-auto hidden md:block">
          <ArticleDetails article={article} />
        </div>
      </div>
    </div>
  )
}
