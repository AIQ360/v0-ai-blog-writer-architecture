import { supabase } from "./supabase-client"
import type { Database } from "./database.types"

export type Article = Database["public"]["Tables"]["articles"]["Row"]
export type ArticleContent = Database["public"]["Tables"]["article_content"]["Row"]
export type Keyword = Database["public"]["Tables"]["keywords"]["Row"]

export type ArticleWithContent = Article & {
  content: ArticleContent | null
  keywords: Keyword[]
}

// Get all articles for the current user
export async function getArticles() {
  const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
    throw error
  }

  return data
}

// Get a single article with its content and keywords
export async function getArticle(id: string): Promise<ArticleWithContent | null> {
  // Get the article
  const { data: article, error: articleError } = await supabase.from("articles").select("*").eq("id", id).single()

  if (articleError) {
    console.error("Error fetching article:", articleError)
    throw articleError
  }

  if (!article) return null

  // Get the article content
  const { data: content, error: contentError } = await supabase
    .from("article_content")
    .select("*")
    .eq("article_id", id)
    .single()

  if (contentError && contentError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which is fine
    console.error("Error fetching article content:", contentError)
    throw contentError
  }

  // Get the keywords
  const { data: keywords, error: keywordsError } = await supabase.from("keywords").select("*").eq("article_id", id)

  if (keywordsError) {
    console.error("Error fetching keywords:", keywordsError)
    throw keywordsError
  }

  return {
    ...article,
    content,
    keywords: keywords || [],
  }
}

// Create a new article
export async function createArticle(
  title: string,
  userId: string,
  contentData?: Partial<ArticleContent>,
  keywordsData?: Omit<Keyword, "id" | "article_id">[],
) {
  // Insert the article
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .insert([{ title, user_id: userId, status: "draft" }])
    .select()
    .single()

  if (articleError) {
    console.error("Error creating article:", articleError)
    throw articleError
  }

  if (contentData) {
    // Insert the article content
    const { error: contentError } = await supabase
      .from("article_content")
      .insert([{ article_id: article.id, ...contentData }])

    if (contentError) {
      console.error("Error creating article content:", contentError)
      throw contentError
    }
  }

  if (keywordsData && keywordsData.length > 0) {
    // Insert the keywords
    const keywordsWithArticleId = keywordsData.map((keyword) => ({
      ...keyword,
      article_id: article.id,
    }))

    const { error: keywordsError } = await supabase.from("keywords").insert(keywordsWithArticleId)

    if (keywordsError) {
      console.error("Error creating keywords:", keywordsError)
      throw keywordsError
    }
  }

  return article
}

// Update an article
export async function updateArticle(
  id: string,
  articleData: Partial<Article>,
  contentData?: Partial<ArticleContent>,
  keywordsData?: Omit<Keyword, "id" | "article_id">[],
) {
  // Update the article
  const { error: articleError } = await supabase.from("articles").update(articleData).eq("id", id)

  if (articleError) {
    console.error("Error updating article:", articleError)
    throw articleError
  }

  if (contentData) {
    // Check if content exists
    const { data: existingContent } = await supabase.from("article_content").select("id").eq("article_id", id).single()

    if (existingContent) {
      // Update existing content
      const { error: contentError } = await supabase.from("article_content").update(contentData).eq("article_id", id)

      if (contentError) {
        console.error("Error updating article content:", contentError)
        throw contentError
      }
    } else {
      // Insert new content
      const { error: contentError } = await supabase
        .from("article_content")
        .insert([{ article_id: id, ...contentData }])

      if (contentError) {
        console.error("Error creating article content:", contentError)
        throw contentError
      }
    }
  }

  if (keywordsData && keywordsData.length > 0) {
    // Delete existing keywords
    const { error: deleteError } = await supabase.from("keywords").delete().eq("article_id", id)

    if (deleteError) {
      console.error("Error deleting keywords:", deleteError)
      throw deleteError
    }

    // Insert new keywords
    const keywordsWithArticleId = keywordsData.map((keyword) => ({
      ...keyword,
      article_id: id,
    }))

    const { error: keywordsError } = await supabase.from("keywords").insert(keywordsWithArticleId)

    if (keywordsError) {
      console.error("Error creating keywords:", keywordsError)
      throw keywordsError
    }
  }

  return getArticle(id)
}

// Delete an article
export async function deleteArticle(id: string) {
  // Delete the article (cascades to content and keywords due to foreign key constraints)
  const { error } = await supabase.from("articles").delete().eq("id", id)

  if (error) {
    console.error("Error deleting article:", error)
    throw error
  }

  return true
}
