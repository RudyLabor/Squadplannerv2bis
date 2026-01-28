/**
 * Database Types - Generated from Supabase
 *
 * TODO: Regenerate this file using:
 * npx supabase gen types typescript --project-id cwtoprbowdqcemdjrtir > src/types/database.types.ts
 *
 * For now, this is a placeholder structure that will be replaced by the actual generated types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string | null
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          role: string
          timezone: string
          language: string
          is_premium: boolean
          is_pro: boolean
          premium_expires_at: string | null
          total_sessions: number
          sessions_attended: number
          reliability_score: number
          total_absences: number
          xp_points: number
          level: number
          created_at: string
          updated_at: string
          last_active_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          auth_id?: string | null
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          timezone?: string
          language?: string
          is_premium?: boolean
          is_pro?: boolean
          premium_expires_at?: string | null
          total_sessions?: number
          sessions_attended?: number
          reliability_score?: number
          total_absences?: number
          xp_points?: number
          level?: number
          created_at?: string
          updated_at?: string
          last_active_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          auth_id?: string | null
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          timezone?: string
          language?: string
          is_premium?: boolean
          is_pro?: boolean
          premium_expires_at?: string | null
          total_sessions?: number
          sessions_attended?: number
          reliability_score?: number
          total_absences?: number
          xp_points?: number
          level?: number
          created_at?: string
          updated_at?: string
          last_active_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      squads: {
        Row: {
          id: string
          name: string
          slug: string | null
          description: string | null
          game: string
          game_mode: string | null
          owner_id: string | null
          invite_code: string
          is_public: boolean
          avatar_url: string | null
          banner_url: string | null
          max_members: number
          preferred_days: string[] | null
          preferred_time: string | null
          session_duration: string
          timezone: string
          total_sessions: number
          total_members: number
          active_members: number
          reliability_score: number
          organization_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          description?: string | null
          game: string
          game_mode?: string | null
          owner_id?: string | null
          invite_code?: string
          is_public?: boolean
          avatar_url?: string | null
          banner_url?: string | null
          max_members?: number
          preferred_days?: string[] | null
          preferred_time?: string | null
          session_duration?: string
          timezone?: string
          total_sessions?: number
          total_members?: number
          active_members?: number
          reliability_score?: number
          organization_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          description?: string | null
          game?: string
          game_mode?: string | null
          owner_id?: string | null
          invite_code?: string
          is_public?: boolean
          avatar_url?: string | null
          banner_url?: string | null
          max_members?: number
          preferred_days?: string[] | null
          preferred_time?: string | null
          session_duration?: string
          timezone?: string
          total_sessions?: number
          total_members?: number
          active_members?: number
          reliability_score?: number
          organization_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squads_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "squads_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      // Additional table types will be generated by Supabase CLI
      [key: string]: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
        Relationships: any[]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
