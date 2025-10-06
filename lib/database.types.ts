export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          status: string
          content_grade: string | null
          created_at: string
          updated_at: string
          language: string
          word_count: number | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          status?: string
          content_grade?: string | null
          created_at?: string
          updated_at?: string
          language?: string
          word_count?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          status?: string
          content_grade?: string | null
          created_at?: string
          updated_at?: string
          language?: string
          word_count?: number | null
        }
      }
      article_content: {
        Row: {
          id: string
          article_id: string
          outline: Json | null
          content: string | null
          keyword_intent: string | null
          narrative: string | null
          questions: Json | null
          versions: Json | null
        }
        Insert: {
          id?: string
          article_id: string
          outline?: Json | null
          content?: string | null
          keyword_intent?: string | null
          narrative?: string | null
          questions?: Json | null
          versions?: Json | null
        }
        Update: {
          id?: string
          article_id?: string
          outline?: Json | null
          content?: string | null
          keyword_intent?: string | null
          narrative?: string | null
          questions?: Json | null
          versions?: Json | null
        }
      }
      keywords: {
        Row: {
          id: string
          article_id: string
          keyword: string
          intent: string | null
          volume: number | null
        }
        Insert: {
          id?: string
          article_id: string
          keyword: string
          intent?: string | null
          volume?: number | null
        }
        Update: {
          id?: string
          article_id?: string
          keyword?: string
          intent?: string | null
          volume?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
