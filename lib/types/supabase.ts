export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          ai_advice: string | null
          ai_summary: string | null
          ai_what_to_do: string | null
          category_id: number | null
          description: string
          id: number
          image_url: string | null
          latitude: number | null
          longitude: number | null
          main_topic: string | null
          sentiment: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          submitted_at: string
          title: string
          user_id: string | null
          // Manually added fields for SLA/Priority feature
          priority: Database["public"]["Enums"]["priority_level"]
          due_date: string | null
        }
        Insert: {
          ai_advice?: string | null
          ai_summary?: string | null
          ai_what_to_do?: string | null
          category_id?: number | null
          description: string
          id?: number
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          main_topic?: string | null
          sentiment?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          submitted_at?: string
          title: string
          user_id?: string | null
          // Manually added fields for SLA/Priority feature
          priority?: Database["public"]["Enums"]["priority_level"]
          due_date?: string | null
        }
        Update: {
          ai_advice?: string | null
          ai_summary?: string | null
          ai_what_to_do?: string | null
          category_id?: number | null
          description?: string
          id?: number
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          main_topic?: string | null
          sentiment?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          submitted_at?: string
          title?: string
          user_id?: string | null
          // Manually added fields for SLA/Priority feature
          priority?: Database["public"]["Enums"]["priority_level"]
          due_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      complaints_with_priority_rank: {
        Row: {
          // This view has all columns from 'complaints' table plus the new rank column
          ai_advice: string | null
          ai_summary: string | null
          ai_what_to_do: string | null
          category_id: number | null
          description: string
          id: number
          image_url: string | null
          latitude: number | null
          longitude: number | null
          main_topic: string | null
          sentiment: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          submitted_at: string
          title: string
          user_id: string | null
          priority: Database["public"]["Enums"]["priority_level"]
          due_date: string | null
          priority_rank: number | null // The new column from our view
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      complaint_status: "open" | "in_progress" | "closed"
      // Manually added ENUM for Priority
      priority_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
