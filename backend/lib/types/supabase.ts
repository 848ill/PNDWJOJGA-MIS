// lib/types/supabase.ts
// Basic Database type interface
// TODO: Generate proper types using: npx supabase gen types typescript

export interface Database {
  public: {
    Tables: {
      complaints: {
        Row: {
          id: string;
          text_content: string;
          category_id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          status: string;
          priority: string;
          location_latitude?: number;
          location_longitude?: number;
          location_address?: string;
        };
        Insert: {
          id?: string;
          text_content: string;
          category_id: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          status?: string;
          priority?: string;
          location_latitude?: number;
          location_longitude?: number;
          location_address?: string;
        };
        Update: {
          id?: string;
          text_content?: string;
          category_id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          status?: string;
          priority?: string;
          location_latitude?: number;
          location_longitude?: number;
          location_address?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      complaints_with_priority_rank: {
        Row: {
          id: string;
          text_content: string;
          category_id: string;
          category_name: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          user_name: string;
          status: string;
          priority: string;
          location_latitude?: number;
          location_longitude?: number;
          location_address?: string;
          priority_rank: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
