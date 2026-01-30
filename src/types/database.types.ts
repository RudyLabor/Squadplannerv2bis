export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string | null
          category: string | null
          code: string
          created_at: string | null
          criteria: Json | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          tier: string | null
          xp_reward: number | null
        }
        Insert: {
          badge_icon?: string | null
          category?: string | null
          code: string
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          tier?: string | null
          xp_reward?: number | null
        }
        Update: {
          badge_icon?: string | null
          category?: string | null
          code?: string
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          tier?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      analytics_squad: {
        Row: {
          avg_attendance: number | null
          avg_reliability: number | null
          avg_response_time: unknown
          cancelled_sessions: number | null
          confirmed_sessions: number | null
          generated_at: string | null
          id: string
          most_active_user_id: string | null
          peak_day: string | null
          peak_time: string | null
          period_end: string
          period_start: string
          period_type: string | null
          squad_id: string | null
          total_playtime: unknown
          total_sessions: number | null
        }
        Insert: {
          avg_attendance?: number | null
          avg_reliability?: number | null
          avg_response_time?: unknown
          cancelled_sessions?: number | null
          confirmed_sessions?: number | null
          generated_at?: string | null
          id?: string
          most_active_user_id?: string | null
          peak_day?: string | null
          peak_time?: string | null
          period_end: string
          period_start: string
          period_type?: string | null
          squad_id?: string | null
          total_playtime?: unknown
          total_sessions?: number | null
        }
        Update: {
          avg_attendance?: number | null
          avg_reliability?: number | null
          avg_response_time?: unknown
          cancelled_sessions?: number | null
          confirmed_sessions?: number | null
          generated_at?: string | null
          id?: string
          most_active_user_id?: string | null
          peak_day?: string | null
          peak_time?: string | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          squad_id?: string | null
          total_playtime?: unknown
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_squad_most_active_user_id_fkey"
            columns: ["most_active_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_squad_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_user: {
        Row: {
          achievements_unlocked: number | null
          favorite_game: string | null
          games_played: Json | null
          generated_at: string | null
          id: string
          mvp_count: number | null
          period_end: string
          period_start: string
          period_type: string | null
          reliability: number | null
          sessions_missed: number | null
          sessions_played: number | null
          total_playtime: unknown
          user_id: string | null
          xp_earned: number | null
        }
        Insert: {
          achievements_unlocked?: number | null
          favorite_game?: string | null
          games_played?: Json | null
          generated_at?: string | null
          id?: string
          mvp_count?: number | null
          period_end: string
          period_start: string
          period_type?: string | null
          reliability?: number | null
          sessions_missed?: number | null
          sessions_played?: number | null
          total_playtime?: unknown
          user_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          achievements_unlocked?: number | null
          favorite_game?: string | null
          games_played?: Json | null
          generated_at?: string | null
          id?: string
          mvp_count?: number | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          reliability?: number | null
          sessions_missed?: number | null
          sessions_played?: number | null
          total_playtime?: unknown
          user_id?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: string[] | null
          rate_limit_per_day: number | null
          rate_limit_per_minute: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: string[] | null
          rate_limit_per_day?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: string[] | null
          rate_limit_per_day?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          request_body: Json | null
          response_time_ms: number | null
          status_code: number | null
          user_agent: string | null
        }
        Insert: {
          api_key_id: string
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          request_body?: Json | null
          response_time_ms?: number | null
          status_code?: number | null
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          request_body?: Json | null
          response_time_ms?: number | null
          status_code?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_key_stats"
            referencedColumns: ["key_id"]
          },
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          code: string
          color: string | null
          created_at: string | null
          criteria: Json | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          rarity: string | null
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rarity?: string | null
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string | null
        }
        Relationships: []
      }
      challenges: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          objective: Json | null
          rewards: Json | null
          start_date: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          objective?: Json | null
          rewards?: Json | null
          start_date: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          objective?: Json | null
          rewards?: Json | null
          start_date?: string
          type?: string | null
        }
        Relationships: []
      }
      discord_guild_links: {
        Row: {
          created_at: string | null
          guild_id: string
          guild_name: string | null
          id: string
          notification_channel_id: string | null
          squad_id: string | null
          updated_at: string | null
          voice_channel_id: string | null
        }
        Insert: {
          created_at?: string | null
          guild_id: string
          guild_name?: string | null
          id?: string
          notification_channel_id?: string | null
          squad_id?: string | null
          updated_at?: string | null
          voice_channel_id?: string | null
        }
        Update: {
          created_at?: string | null
          guild_id?: string
          guild_name?: string | null
          id?: string
          notification_channel_id?: string | null
          squad_id?: string | null
          updated_at?: string | null
          voice_channel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discord_guild_links_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_link_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discord_link_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discord_link_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reliability_leaderboard"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_links: {
        Row: {
          created_at: string | null
          discord_avatar: string | null
          discord_id: string
          discord_username: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discord_avatar?: string | null
          discord_id: string
          discord_username?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discord_avatar?: string | null
          discord_id?: string
          discord_username?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discord_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discord_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reliability_leaderboard"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_limits: {
        Row: {
          created_at: string
          has_advanced_stats: boolean | null
          has_ai_suggestions: boolean | null
          has_api_access: boolean | null
          has_calendar_export: boolean | null
          has_custom_roles: boolean | null
          has_discord_bot_advanced: boolean | null
          has_priority_support: boolean | null
          has_webhooks: boolean | null
          has_white_label: boolean | null
          history_days: number | null
          id: string
          max_members_per_squad: number | null
          max_recurring_sessions: number | null
          max_sessions_per_month: number | null
          max_squads: number | null
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Insert: {
          created_at?: string
          has_advanced_stats?: boolean | null
          has_ai_suggestions?: boolean | null
          has_api_access?: boolean | null
          has_calendar_export?: boolean | null
          has_custom_roles?: boolean | null
          has_discord_bot_advanced?: boolean | null
          has_priority_support?: boolean | null
          has_webhooks?: boolean | null
          has_white_label?: boolean | null
          history_days?: number | null
          id?: string
          max_members_per_squad?: number | null
          max_recurring_sessions?: number | null
          max_sessions_per_month?: number | null
          max_squads?: number | null
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Update: {
          created_at?: string
          has_advanced_stats?: boolean | null
          has_ai_suggestions?: boolean | null
          has_api_access?: boolean | null
          has_calendar_export?: boolean | null
          has_custom_roles?: boolean | null
          has_discord_bot_advanced?: boolean | null
          has_priority_support?: boolean | null
          has_webhooks?: boolean | null
          has_white_label?: boolean | null
          history_days?: number | null
          id?: string
          max_members_per_squad?: number | null
          max_recurring_sessions?: number | null
          max_sessions_per_month?: number | null
          max_squads?: number | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
        }
        Relationships: []
      }
      friendships: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          friend_id: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          connected_at: string | null
          disconnected_at: string | null
          external_id: string | null
          external_username: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          service: string
          settings: Json | null
          sync_error: string | null
          token_expires_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          disconnected_at?: string | null
          external_id?: string | null
          external_username?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          service: string
          settings?: Json | null
          sync_error?: string | null
          token_expires_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          disconnected_at?: string | null
          external_id?: string | null
          external_username?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          service?: string
          settings?: Json | null
          sync_error?: string | null
          token_expires_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_e884809f: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      league_teams: {
        Row: {
          division: string | null
          draws: number | null
          id: string
          joined_at: string | null
          league_id: string | null
          losses: number | null
          points: number | null
          rank: number | null
          squad_id: string | null
          wins: number | null
        }
        Insert: {
          division?: string | null
          draws?: number | null
          id?: string
          joined_at?: string | null
          league_id?: string | null
          losses?: number | null
          points?: number | null
          rank?: number | null
          squad_id?: string | null
          wins?: number | null
        }
        Update: {
          division?: string | null
          draws?: number | null
          id?: string
          joined_at?: string | null
          league_id?: string | null
          losses?: number | null
          points?: number | null
          rank?: number | null
          squad_id?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_teams_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          divisions: Json | null
          end_date: string
          game: string
          id: string
          name: string
          organization_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          divisions?: Json | null
          end_date: string
          game: string
          id?: string
          name: string
          organization_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          divisions?: Json | null
          end_date?: string
          game?: string
          id?: string
          name?: string
          organization_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_type: string | null
          attachment_url: string | null
          content: string
          created_at: string | null
          deleted_at: string | null
          edited_at: string | null
          id: string
          mentions: string[] | null
          reply_to_id: string | null
          squad_id: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attachment_type?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          mentions?: string[] | null
          reply_to_id?: string | null
          squad_id?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          mentions?: string[] | null
          reply_to_id?: string | null
          squad_id?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          body: string | null
          clicked_at: string | null
          created_at: string | null
          data: Json | null
          delivered_at: string | null
          error_message: string | null
          id: string
          notification_type: string
          sent_at: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          clicked_at?: string | null
          created_at?: string | null
          data?: Json | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_type: string
          sent_at?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          clicked_at?: string | null
          created_at?: string | null
          data?: Json | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_type?: string
          sent_at?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reliability_leaderboard"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_analytics: {
        Row: {
          active_members: number | null
          avg_attendance_rate: number | null
          avg_reliability_score: number | null
          check_ins_count: number | null
          churned_members: number | null
          created_at: string | null
          id: string
          messages_count: number | null
          new_members: number | null
          organization_id: string
          period_end: string
          period_start: string
          period_type: string
          sessions_created: number | null
          total_attendance: number | null
          total_members: number | null
          total_sessions: number | null
          total_squads: number | null
        }
        Insert: {
          active_members?: number | null
          avg_attendance_rate?: number | null
          avg_reliability_score?: number | null
          check_ins_count?: number | null
          churned_members?: number | null
          created_at?: string | null
          id?: string
          messages_count?: number | null
          new_members?: number | null
          organization_id: string
          period_end: string
          period_start: string
          period_type: string
          sessions_created?: number | null
          total_attendance?: number | null
          total_members?: number | null
          total_sessions?: number | null
          total_squads?: number | null
        }
        Update: {
          active_members?: number | null
          avg_attendance_rate?: number | null
          avg_reliability_score?: number | null
          check_ins_count?: number | null
          churned_members?: number | null
          created_at?: string | null
          id?: string
          messages_count?: number | null
          new_members?: number | null
          organization_id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          sessions_created?: number | null
          total_attendance?: number | null
          total_members?: number | null
          total_sessions?: number | null
          total_squads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string | null
          expires_at: string | null
          id: string
          invite_code: string
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          invite_code: string
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          invite_code?: string
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          department: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          organization_id: string
          permissions: string[] | null
          role: Database["public"]["Enums"]["org_role"]
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          department?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          organization_id: string
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["org_role"]
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          department?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          organization_id?: string
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["org_role"]
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_squads: {
        Row: {
          added_at: string | null
          added_by: string | null
          display_order: number | null
          id: string
          is_public: boolean | null
          organization_id: string
          squad_id: string
          tier: Database["public"]["Enums"]["squad_tier"]
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          display_order?: number | null
          id?: string
          is_public?: boolean | null
          organization_id: string
          squad_id: string
          tier?: Database["public"]["Enums"]["squad_tier"]
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          display_order?: number | null
          id?: string
          is_public?: boolean | null
          organization_id?: string
          squad_id?: string
          tier?: Database["public"]["Enums"]["squad_tier"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_squads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_squads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_squads_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          banner_url: string | null
          created_at: string | null
          created_by: string | null
          custom_domain: string | null
          description: string | null
          discord_server_id: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          max_members: number | null
          max_squads: number | null
          name: string
          plan: string
          primary_color: string | null
          secondary_color: string | null
          slug: string
          type: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_domain?: string | null
          description?: string | null
          discord_server_id?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          max_members?: number | null
          max_squads?: number | null
          name: string
          plan?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_domain?: string | null
          description?: string | null
          discord_server_id?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          max_members?: number | null
          max_squads?: number | null
          name?: string
          plan?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birthday: string | null
          created_at: string | null
          discord_id: string | null
          discord_username: string | null
          display_name: string | null
          email: string | null
          favorite_game: string | null
          id: string
          is_premium: boolean | null
          last_reliability_update: string | null
          location: string | null
          notification_settings: Json | null
          play_style: string | null
          reliability_score: number | null
          sessions_attended: number | null
          sessions_late: number | null
          sessions_no_show: number | null
          total_sessions: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string | null
          discord_id?: string | null
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          favorite_game?: string | null
          id: string
          is_premium?: boolean | null
          last_reliability_update?: string | null
          location?: string | null
          notification_settings?: Json | null
          play_style?: string | null
          reliability_score?: number | null
          sessions_attended?: number | null
          sessions_late?: number | null
          sessions_no_show?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string | null
          discord_id?: string | null
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          favorite_game?: string | null
          id?: string
          is_premium?: boolean | null
          last_reliability_update?: string | null
          location?: string | null
          notification_settings?: Json | null
          play_style?: string | null
          reliability_score?: number | null
          sessions_attended?: number | null
          sessions_late?: number | null
          sessions_no_show?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string | null
          device_info: Json | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh_key: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string | null
          device_info?: Json | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh_key: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string | null
          device_info?: Json | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh_key?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reliability_leaderboard"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_sessions: {
        Row: {
          created_at: string | null
          created_by: string | null
          day_of_week: number | null
          deactivated_at: string | null
          description: string | null
          duration: unknown
          id: string
          is_active: boolean | null
          last_generated_at: string | null
          scheduled_time: string
          squad_id: string | null
          timezone: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          day_of_week?: number | null
          deactivated_at?: string | null
          description?: string | null
          duration?: unknown
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          scheduled_time: string
          squad_id?: string | null
          timezone?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          day_of_week?: number | null
          deactivated_at?: string | null
          description?: string | null
          duration?: unknown
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          scheduled_time?: string
          squad_id?: string | null
          timezone?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_sessions_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      reliability_scores: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_updated_at: string
          longest_streak: number
          score: number
          sessions_attended: number
          sessions_late: number
          sessions_no_show: number
          squad_id: string | null
          total_sessions: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_updated_at?: string
          longest_streak?: number
          score?: number
          sessions_attended?: number
          sessions_late?: number
          sessions_no_show?: number
          squad_id?: string | null
          total_sessions?: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_updated_at?: string
          longest_streak?: number
          score?: number
          sessions_attended?: number
          sessions_late?: number
          sessions_no_show?: number
          squad_id?: string | null
          total_sessions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reliability_scores_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reliability_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          granted_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          granted_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          granted_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          can_create_sessions: boolean | null
          can_manage_members: boolean | null
          can_manage_roles: boolean | null
          can_manage_sessions: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_admin: boolean | null
          name: string
          squad_id: string | null
        }
        Insert: {
          can_create_sessions?: boolean | null
          can_manage_members?: boolean | null
          can_manage_roles?: boolean | null
          can_manage_sessions?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_admin?: boolean | null
          name: string
          squad_id?: string | null
        }
        Update: {
          can_create_sessions?: boolean | null
          can_manage_members?: boolean | null
          can_manage_roles?: boolean | null
          can_manage_sessions?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string
          squad_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      season_stats: {
        Row: {
          avg_reliability: number | null
          id: string
          last_updated_at: string | null
          rank: number | null
          season_id: string | null
          sessions_played: number | null
          squad_id: string | null
          total_playtime: unknown
        }
        Insert: {
          avg_reliability?: number | null
          id?: string
          last_updated_at?: string | null
          rank?: number | null
          season_id?: string | null
          sessions_played?: number | null
          squad_id?: string | null
          total_playtime?: unknown
        }
        Update: {
          avg_reliability?: number | null
          id?: string
          last_updated_at?: string | null
          rank?: number | null
          season_id?: string | null
          sessions_played?: number | null
          squad_id?: string | null
          total_playtime?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "season_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_stats_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          goals: Json | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string | null
          start_date: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          goals?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id?: string | null
          start_date: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          goals?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string | null
          start_date?: string
        }
        Relationships: []
      }
      session_attendees: {
        Row: {
          id: string
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reliability_leaderboard"
            referencedColumns: ["id"]
          },
        ]
      }
      session_check_ins: {
        Row: {
          checked_in_at: string
          id: string
          notes: string | null
          session_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          id?: string
          notes?: string | null
          session_id: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          checked_in_at?: string
          id?: string
          notes?: string | null
          session_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_check_ins_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_check_ins_session_id_idx"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_check_ins_user_id_idx"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_reminders_sent: {
        Row: {
          channel_id: string | null
          id: string
          message_id: string | null
          reminder_type: string
          sent_at: string | null
          session_id: string | null
        }
        Insert: {
          channel_id?: string | null
          id?: string
          message_id?: string | null
          reminder_type: string
          sent_at?: string | null
          session_id?: string | null
        }
        Update: {
          channel_id?: string | null
          id?: string
          message_id?: string | null
          reminder_type?: string
          sent_at?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_reminders_sent_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_rsvps: {
        Row: {
          checked_in: boolean | null
          checked_in_at: string | null
          id: string
          notes: string | null
          responded_at: string | null
          response: string
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          id?: string
          notes?: string | null
          responded_at?: string | null
          response: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          id?: string
          notes?: string | null
          responded_at?: string | null
          response?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_rsvps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          duration: unknown
          game: string | null
          game_mode: string | null
          id: string
          is_recurring: boolean | null
          max_players: number | null
          min_players: number | null
          notes: string | null
          proposed_by: string | null
          recurring_session_id: string | null
          required_players: number | null
          scheduled_date: string
          scheduled_time: string
          squad_id: string | null
          started_at: string | null
          status: string | null
          timezone: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration?: unknown
          game?: string | null
          game_mode?: string | null
          id?: string
          is_recurring?: boolean | null
          max_players?: number | null
          min_players?: number | null
          notes?: string | null
          proposed_by?: string | null
          recurring_session_id?: string | null
          required_players?: number | null
          scheduled_date: string
          scheduled_time: string
          squad_id?: string | null
          started_at?: string | null
          status?: string | null
          timezone?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration?: unknown
          game?: string | null
          game_mode?: string | null
          id?: string
          is_recurring?: boolean | null
          max_players?: number | null
          min_players?: number | null
          notes?: string | null
          proposed_by?: string | null
          recurring_session_id?: string | null
          required_players?: number | null
          scheduled_date?: string
          scheduled_time?: string
          squad_id?: string | null
          started_at?: string | null
          status?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_proposed_by_fkey"
            columns: ["proposed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_recurring_session_id_fkey"
            columns: ["recurring_session_id"]
            isOneToOne: false
            referencedRelation: "recurring_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_members: {
        Row: {
          id: string
          joined_at: string | null
          last_active_at: string | null
          left_at: string | null
          reliability_score: number | null
          role: string | null
          sessions_attended: number | null
          sessions_missed: number | null
          squad_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          left_at?: string | null
          reliability_score?: number | null
          role?: string | null
          sessions_attended?: number | null
          sessions_missed?: number | null
          squad_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          left_at?: string | null
          reliability_score?: number | null
          role?: string | null
          sessions_attended?: number | null
          sessions_missed?: number | null
          squad_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "squad_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_permissions: {
        Row: {
          category: string | null
          description: string | null
          id: string
          name: string
          requires_role: Database["public"]["Enums"]["squad_role"]
        }
        Insert: {
          category?: string | null
          description?: string | null
          id: string
          name: string
          requires_role: Database["public"]["Enums"]["squad_role"]
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          name?: string
          requires_role?: Database["public"]["Enums"]["squad_role"]
        }
        Relationships: []
      }
      squads: {
        Row: {
          active_members: number | null
          avatar_url: string | null
          banner_url: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          game: string
          game_mode: string | null
          id: string
          invite_code: string
          is_public: boolean | null
          max_members: number | null
          name: string
          organization_id: string | null
          owner_id: string | null
          preferred_days: string[] | null
          preferred_time: string | null
          reliability_score: number | null
          session_duration: unknown
          slug: string | null
          timezone: string | null
          total_members: number | null
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          active_members?: number | null
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          game: string
          game_mode?: string | null
          id?: string
          invite_code?: string
          is_public?: boolean | null
          max_members?: number | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          preferred_days?: string[] | null
          preferred_time?: string | null
          reliability_score?: number | null
          session_duration?: unknown
          slug?: string | null
          timezone?: string | null
          total_members?: number | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          active_members?: number | null
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          game?: string
          game_mode?: string | null
          id?: string
          invite_code?: string
          is_public?: boolean | null
          max_members?: number | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          preferred_days?: string[] | null
          preferred_time?: string | null
          reliability_score?: number | null
          session_duration?: unknown
          slug?: string | null
          timezone?: string | null
          total_members?: number | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          status: string | null
          stripe_event_id: string
        }
        Insert: {
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          status?: string | null
          stripe_event_id: string
        }
        Update: {
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          status?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          id: string
          registered_at: string | null
          squad_id: string
          status: string | null
          tournament_id: string
        }
        Insert: {
          id?: string
          registered_at?: string | null
          squad_id: string
          status?: string | null
          tournament_id: string
        }
        Update: {
          id?: string
          registered_at?: string | null
          squad_id?: string
          status?: string | null
          tournament_id?: string
        }
        Relationships: []
      }
      tournament_teams: {
        Row: {
          checked_in_at: string | null
          eliminated_at: string | null
          final_placement: number | null
          id: string
          losses: number | null
          registered_at: string | null
          seed: number | null
          squad_id: string | null
          status: string | null
          tournament_id: string | null
          wins: number | null
        }
        Insert: {
          checked_in_at?: string | null
          eliminated_at?: string | null
          final_placement?: number | null
          id?: string
          losses?: number | null
          registered_at?: string | null
          seed?: number | null
          squad_id?: string | null
          status?: string | null
          tournament_id?: string | null
          wins?: number | null
        }
        Update: {
          checked_in_at?: string | null
          eliminated_at?: string | null
          final_placement?: number | null
          id?: string
          losses?: number | null
          registered_at?: string | null
          seed?: number | null
          squad_id?: string | null
          status?: string | null
          tournament_id?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          end_date: string
          format: string | null
          game: string
          id: string
          max_teams: number | null
          min_teams: number | null
          name: string
          organization_id: string | null
          organizer_id: string | null
          prize_pool: string | null
          prizes: Json | null
          registration_deadline: string | null
          rules: string | null
          start_date: string
          status: string | null
          team_size: number | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          format?: string | null
          game: string
          id?: string
          max_teams?: number | null
          min_teams?: number | null
          name: string
          organization_id?: string | null
          organizer_id?: string | null
          prize_pool?: string | null
          prizes?: Json | null
          registration_deadline?: string | null
          rules?: string | null
          start_date: string
          status?: string | null
          team_size?: number | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          format?: string | null
          game?: string
          id?: string
          max_teams?: number | null
          min_teams?: number | null
          name?: string
          organization_id?: string | null
          organizer_id?: string | null
          prize_pool?: string | null
          prizes?: Json | null
          registration_deadline?: string | null
          rules?: string | null
          start_date?: string
          status?: string | null
          team_size?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          id: string
          period_start: string
          recurring_sessions_created: number | null
          sessions_created: number | null
          squads_created: number | null
          user_id: string
        }
        Insert: {
          id?: string
          period_start?: string
          recurring_sessions_created?: number | null
          sessions_created?: number | null
          squads_created?: number | null
          user_id: string
        }
        Update: {
          id?: string
          period_start?: string
          recurring_sessions_created?: number | null
          sessions_created?: number | null
          squads_created?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          created_at: string | null
          id: string
          progress: number | null
          total_required: number | null
          unlocked: boolean | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          total_required?: number | null
          unlocked?: boolean | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          total_required?: number | null
          unlocked?: boolean | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          awarded_by: string | null
          badge_id: string | null
          id: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string | null
          claimed_at: string | null
          completed: boolean | null
          completed_at: string | null
          id: string
          progress: number | null
          rewards_claimed: boolean | null
          started_at: string | null
          total_required: number
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          claimed_at?: string | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          progress?: number | null
          rewards_claimed?: boolean | null
          started_at?: string | null
          total_required: number
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          claimed_at?: string | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          progress?: number | null
          rewards_claimed?: boolean | null
          started_at?: string | null
          total_required?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenge_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_webhooks: {
        Row: {
          created_at: string | null
          events: string[]
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_status_code: number | null
          last_triggered_at: string | null
          name: string
          retry_count: number | null
          secret: string | null
          squad_id: string | null
          timeout_seconds: number | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events?: string[]
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_status_code?: number | null
          last_triggered_at?: string | null
          name: string
          retry_count?: number | null
          secret?: string | null
          squad_id?: string | null
          timeout_seconds?: number | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: string[]
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_status_code?: number | null
          last_triggered_at?: string | null
          name?: string
          retry_count?: number | null
          secret?: string | null
          squad_id?: string | null
          timeout_seconds?: number | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_webhooks_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string | null
          email: string
          id: string
          is_premium: boolean | null
          is_pro: boolean | null
          language: string | null
          last_active_at: string | null
          last_reliability_update: string | null
          level: number | null
          premium_expires_at: string | null
          reliability_score: number | null
          role: string | null
          sessions_attended: number | null
          sessions_late: number | null
          sessions_no_show: number | null
          timezone: string | null
          total_absences: number | null
          total_sessions: number | null
          updated_at: string | null
          username: string
          xp_points: number | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          is_premium?: boolean | null
          is_pro?: boolean | null
          language?: string | null
          last_active_at?: string | null
          last_reliability_update?: string | null
          level?: number | null
          premium_expires_at?: string | null
          reliability_score?: number | null
          role?: string | null
          sessions_attended?: number | null
          sessions_late?: number | null
          sessions_no_show?: number | null
          timezone?: string | null
          total_absences?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          username: string
          xp_points?: number | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          is_premium?: boolean | null
          is_pro?: boolean | null
          language?: string | null
          last_active_at?: string | null
          last_reliability_update?: string | null
          level?: number | null
          premium_expires_at?: string | null
          reliability_score?: number | null
          role?: string | null
          sessions_attended?: number | null
          sessions_late?: number | null
          sessions_no_show?: number | null
          timezone?: string | null
          total_absences?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          username?: string
          xp_points?: number | null
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          delivered_at: string | null
          event_type: string
          id: string
          next_retry_at: string | null
          payload: Json
          response_body: string | null
          status: string
          status_code: number | null
          webhook_id: string
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          delivered_at?: string | null
          event_type: string
          id?: string
          next_retry_at?: string | null
          payload: Json
          response_body?: string | null
          status?: string
          status_code?: number | null
          webhook_id: string
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          delivered_at?: string | null
          event_type?: string
          id?: string
          next_retry_at?: string | null
          payload?: Json
          response_body?: string | null
          status?: string
          status_code?: number | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "user_webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: string[]
          failed_calls: number | null
          id: string
          is_active: boolean | null
          last_called_at: string | null
          last_error: string | null
          secret: string | null
          squad_id: string | null
          total_calls: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          events: string[]
          failed_calls?: number | null
          id?: string
          is_active?: boolean | null
          last_called_at?: string | null
          last_error?: string | null
          secret?: string | null
          squad_id?: string | null
          total_calls?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          events?: string[]
          failed_calls?: number | null
          id?: string
          is_active?: boolean | null
          last_called_at?: string | null
          last_error?: string | null
          secret?: string | null
          squad_id?: string | null
          total_calls?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      api_key_stats: {
        Row: {
          avg_response_time_ms: number | null
          created_at: string | null
          is_active: boolean | null
          key_id: string | null
          key_prefix: string | null
          last_used_at: string | null
          name: string | null
          rate_limit_per_day: number | null
          rate_limit_per_minute: number | null
          requests_today: number | null
          total_requests: number | null
          user_id: string | null
        }
        Relationships: []
      }
      organization_dashboard: {
        Row: {
          created_at: string | null
          id: string | null
          is_verified: boolean | null
          logo_url: string | null
          max_members: number | null
          max_squads: number | null
          member_count: number | null
          name: string | null
          plan: string | null
          slug: string | null
          squad_count: number | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          max_members?: number | null
          max_squads?: number | null
          member_count?: never
          name?: string | null
          plan?: string | null
          slug?: string | null
          squad_count?: never
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          max_members?: number | null
          max_squads?: number | null
          member_count?: never
          name?: string | null
          plan?: string | null
          slug?: string | null
          squad_count?: never
          type?: string | null
        }
        Relationships: []
      }
      reliability_leaderboard: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string | null
          rank: number | null
          reliability_score: number | null
          sessions_attended: number | null
          tier: string | null
          total_sessions: number | null
        }
        Relationships: []
      }
      squad_members_with_roles: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string | null
          joined_at: string | null
          reliability_score: number | null
          role: string | null
          role_priority: number | null
          squad_id: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "squad_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_org_invite: { Args: { p_code: string }; Returns: string }
      add_squad_to_organization: {
        Args: {
          p_org_id: string
          p_squad_id: string
          p_tier?: Database["public"]["Enums"]["squad_tier"]
        }
        Returns: boolean
      }
      award_badges_to_user: {
        Args: { user_uuid: string }
        Returns: {
          awarded: boolean
          badge_id: string
          removed: boolean
        }[]
      }
      calculate_reliability_score: {
        Args: { attended: number; total: number }
        Returns: number
      }
      calculate_user_reliability: {
        Args: { user_uuid: string }
        Returns: number
      }
      can_create_session: { Args: { p_user_id: string }; Returns: boolean }
      can_create_squad: { Args: { p_user_id: string }; Returns: boolean }
      check_badge_fantome: { Args: { user_uuid: string }; Returns: boolean }
      check_badge_leader_fiable: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_badge_pilier_squad: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_badge_ponctuel: { Args: { user_uuid: string }; Returns: boolean }
      check_rate_limit: {
        Args: { p_key_id: string }
        Returns: {
          allowed: boolean
          limit_per_day: number
          limit_per_minute: number
          requests_this_minute: number
          requests_today: number
        }[]
      }
      cleanup_expired_discord_codes: { Args: never; Returns: number }
      cleanup_old_api_usage: { Args: never; Returns: number }
      create_organization: {
        Args: { p_description?: string; p_name: string; p_type?: string }
        Returns: string
      }
      create_user_webhook: {
        Args: {
          p_events: string[]
          p_name: string
          p_squad_id?: string
          p_url: string
          p_user_id: string
        }
        Returns: string
      }
      generate_api_key: {
        Args: {
          p_name: string
          p_permissions?: string[]
          p_rate_limit_per_minute?: number
          p_user_id: string
        }
        Returns: {
          api_key: string
          key_id: string
        }[]
      }
      generate_discord_link_code: {
        Args: { p_user_id: string }
        Returns: string
      }
      generate_invite_code: { Args: never; Returns: string }
      generate_org_invite: {
        Args: {
          p_email?: string
          p_org_id: string
          p_role?: Database["public"]["Enums"]["org_role"]
        }
        Returns: string
      }
      generate_slug: { Args: { name: string }; Returns: string }
      get_organization_stats: {
        Args: { p_org_id: string }
        Returns: {
          active_members: number
          avg_attendance_rate: number
          avg_reliability_score: number
          total_members: number
          total_sessions_this_month: number
          total_squads: number
        }[]
      }
      get_session_notification_targets: {
        Args: { p_reminder_type: string; p_session_id: string }
        Returns: {
          auth_key: string
          display_name: string
          endpoint: string
          p256dh_key: string
          user_id: string
        }[]
      }
      get_user_detailed_stats: {
        Args: { user_uuid: string }
        Returns: {
          attendance_rate: number
          attended: number
          display_name: string
          last_updated: string
          late: number
          late_rate: number
          no_show: number
          no_show_rate: number
          score: number
          total: number
          user_id: string
        }[]
      }
      get_user_limits: {
        Args: { p_user_id: string }
        Returns: {
          has_advanced_stats: boolean
          has_ai_suggestions: boolean
          has_api_access: boolean
          has_calendar_export: boolean
          has_custom_roles: boolean
          has_discord_bot_advanced: boolean
          has_priority_support: boolean
          has_webhooks: boolean
          has_white_label: boolean
          history_days: number
          max_members_per_squad: number
          max_recurring_sessions: number
          max_sessions_per_month: number
          max_squads: number
          tier: Database["public"]["Enums"]["subscription_tier"]
        }[]
      }
      get_user_push_subscriptions: {
        Args: { p_user_id: string }
        Returns: {
          auth_key: string
          endpoint: string
          p256dh_key: string
        }[]
      }
      get_user_squad_ids: { Args: { user_uuid: string }; Returns: string[] }
      get_user_squad_role: {
        Args: { squad_uuid: string; user_uuid: string }
        Returns: string
      }
      get_user_tier: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      increment_usage: {
        Args: { p_amount?: number; p_field: string; p_user_id: string }
        Returns: undefined
      }
      is_squad_admin: {
        Args: { squad_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_squad_co_leader: {
        Args: { squad_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_squad_leader: {
        Args: { squad_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_squad_owner: {
        Args: { squad_uuid: string; user_uuid: string }
        Returns: boolean
      }
      kick_squad_member: {
        Args: {
          kicker_uuid: string
          reason?: string
          squad_uuid: string
          target_user_uuid: string
        }
        Returns: boolean
      }
      log_api_usage: {
        Args: {
          p_endpoint: string
          p_ip_address?: string
          p_key_id: string
          p_method: string
          p_response_time_ms?: number
          p_status_code?: number
        }
        Returns: undefined
      }
      promote_squad_member: {
        Args: {
          new_role: string
          promoter_uuid: string
          squad_uuid: string
          target_user_uuid: string
        }
        Returns: boolean
      }
      queue_webhook_delivery: {
        Args: {
          p_event_type: string
          p_payload: Json
          p_squad_id?: string
          p_user_id?: string
        }
        Returns: number
      }
      recalculate_all_reliability: {
        Args: never
        Returns: {
          new_score: number
          old_score: number
          user_id: string
        }[]
      }
      user_has_feature: {
        Args: { p_feature: string; p_user_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: { permission_id: string; squad_uuid: string; user_uuid: string }
        Returns: boolean
      }
      validate_api_key: {
        Args: { p_api_key: string }
        Returns: {
          key_id: string
          permissions: string[]
          rate_limit_per_day: number
          rate_limit_per_minute: number
          user_id: string
        }[]
      }
      verify_discord_link_code: { Args: { p_code: string }; Returns: string }
    }
    Enums: {
      org_role: "owner" | "admin" | "manager" | "coach" | "player" | "staff"
      squad_role: "leader" | "co_leader" | "member"
      squad_tier: "main" | "academy" | "content" | "casual"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "trialing"
        | "paused"
      subscription_tier: "free" | "premium" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      org_role: ["owner", "admin", "manager", "coach", "player", "staff"],
      squad_role: ["leader", "co_leader", "member"],
      squad_tier: ["main", "academy", "content", "casual"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "paused",
      ],
      subscription_tier: ["free", "premium", "pro", "enterprise"],
    },
  },
} as const
