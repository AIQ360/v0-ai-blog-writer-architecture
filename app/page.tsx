import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Search, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">AI Blog Writer</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create high-quality, SEO-optimized blog content in minutes with our AI-powered writing assistant
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="mr-4">
            <Link href="/articles/new">Create New Article</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/articles">View My Articles</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Content Research</CardTitle>
            <CardDescription>Analyze top-performing content in your niche</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our AI analyzes competitor content to identify patterns, gaps, and opportunities for your blog.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Search className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>Keyword Analysis</CardTitle>
            <CardDescription>Discover and organize relevant keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Find related keywords and understand search intent to optimize your content for SEO.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-amber-500 mb-2" />
            <CardTitle>Content Strategy</CardTitle>
            <CardDescription>Create comprehensive content outlines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Generate SEO-friendly titles, detailed outlines, and content briefs to guide your writing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>AI Writing</CardTitle>
            <CardDescription>Generate high-quality blog content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Create polished, engaging blog posts with our advanced Gemini 2.0 Flash integration.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to transform your content creation?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Start creating SEO-optimized blog content in minutes with our AI-powered writing assistant.
        </p>
        <Button asChild size="lg">
          <Link href="/articles/new">Get Started Now</Link>
        </Button>
      </div>
    </div>
  )
}
