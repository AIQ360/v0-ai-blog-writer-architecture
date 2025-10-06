"use client"

import { useState } from "react"

export default function ArticleEditor({ article }) {
  const [content, setContent] = useState(article.content || "")

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          An easy way to create amazing blog content with the help of smart AI tools.
        </p>

        <p className="mb-4">
          AI blog writers transform content creation by leveraging advanced machine learning to interpret text prompts
          and generate high-quality articles. Just describe a topic or provide an outline to get well-structured content
          within minutes.
        </p>

        <p className="mb-4">
          These tools streamline content production across various fields. They help content marketers create consistent
          blog posts, assist writers with research and drafting, and enable businesses to maintain regular publishing
          schedules without extensive resources.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features of AI Blog Writers</h2>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Professional Content:</strong> Create consistent, polished articles for your blog or website.
          </li>
          <li>
            <strong>SEO Optimization:</strong> Generate content with proper keyword usage and structure.
          </li>
          <li>
            <strong>Research Integration:</strong> Automatically incorporate relevant information and data.
          </li>
        </ul>

        {/* Additional content would go here */}
      </div>
    </div>
  )
}
